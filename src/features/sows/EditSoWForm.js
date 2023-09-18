import { useState, useEffect } from "react"
import { useUpdateSoWMutation, useDeleteSoWMutation } from "./sowsApiSlice"
import { useNavigate } from "react-router-dom"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSave, faTrashCan, faFileWord } from "@fortawesome/free-solid-svg-icons"
import useAuth from "../../hooks/useAuth"
import PizZip from 'pizzip';
import Docxtemplater from 'docxtemplater';
import FileSaver from 'file-saver';
import axios from 'axios';


const EditSoWform = ({ sow, users }) => {

    const { isManager, isAdmin } = useAuth()

    const [updateSow, {
        isLoading,
        isSuccess,
        isError,
        error
    }] = useUpdateSoWMutation()

    const [deleteSow, {
        isSuccess: isDelSuccess,
        isError: isDelError,
        error: delerror
    }] = useDeleteSoWMutation()

    const navigate = useNavigate()

    const [name, setName] = useState(sow.name)
    const [vms, setVms] = useState(sow.vms)
    const [landing_zones, setLandingZones] = useState(sow.landing_zones)
    const [hours, setHours] = useState(sow.hours)
    const [months, setMonths] = useState(sow.months)
    const [userId, setUserId] = useState(sow.user)
    const [type, setType] = useState(sow.type)
    const [engineer_hourly, setEngineerRate] = useState(sow.engineer_hourly);
    const [architect_hourly, setArchitectRate] = useState(sow.architect_hourly);
    const [pm_hourly, setPmRate] = useState(sow.pm_hourly);
    const [showId, setShowId] = useState(true);

    const canSave = [name, userId].every(Boolean) && !isLoading

    useEffect(() => {

        if (isSuccess || isDelSuccess) {
            setName('')
            setVms('')
            setLandingZones('')
            setHours('')
            setMonths('')
            setUserId('')
            navigate('/dash/sows/view-sows')
        }

    }, [isSuccess, isDelSuccess, navigate])

    const onNameChanged = e => setName(e.target.value)
    const onVmsChanged = e => setVms(e.target.value)
    const onLandingZonesChanged = e => setLandingZones(e.target.value)
    const onHoursChanged = e => setHours(e.target.value)
    const onMonthsChanged = e => setMonths(e.target.value)

    const onSaveSowClicked = async (e) => {
        if (canSave) {
            await updateSow({ id: sow.id, user: userId, name, type, vms, landing_zones, hours, months })
        }
    }

    const onDeleteSowClicked = async () => {
        await deleteSow({ id: sow.id })
    }

    const onGenerateWordClicked = async () => {
        let templateURL = '';
        let docData = {};
        let filename = '';

        // Determine which template to use and set the appropriate data
        if (type === 'Lift and shift') {
            templateURL = process.env.PUBLIC_URL + '/LAStemplate.docx';
            docData = {
                NAME: name,
                VMS: vms,
                LANDINGZONES: landing_zones
            };
            filename = `${name}_Lift_and_Shift.docx`;
        } else if (type === 'Arc as a Service') {
            templateURL = process.env.PUBLIC_URL + '/AAAStemplate.docx';
            docData = {
                NAME: name,
                HOURS: hours,
                MONTHS: months
            };
            filename = `${name}_Arc_as_Service.docx`;
        } else {
            console.error('Unknown type:', type);
            return;
        }

        try {
            // Fetch the appropriate template
            const response = await axios.get(templateURL, { responseType: 'arraybuffer' });

            // Load the docx file from the response
            const zip = new PizZip(response.data);
            
            // Create a docxtemplater instance
            const doc = new Docxtemplater(zip);

            // Set the templateVariables
            doc.setData(docData);

            // Apply the changes
            doc.render();

            // Get the document as binary data
            const docBinary = doc.getZip().generate({ type: "blob" });

            // Use FileSaver to save the file
            FileSaver.saveAs(docBinary, filename);

        } catch (error) {
            console.error('Error loading .docx template: ', error);
        }
    }

    const toggleShowId = () => {
      setShowId(!showId);
    }
    
    let deleteButton = null
    if (isManager || isAdmin) {
        deleteButton = (
            <button
                className="icon-button"
                title="Delete"
                onClick={onDeleteSowClicked}
            >
                <FontAwesomeIcon icon={faTrashCan} />
            </button>
        )
    }

    const content = (
        <>
    

    <form className="form" onSubmit={e => e.preventDefault()}>
        <div className="newSoW-title-row">
            <h2 onClick={toggleShowId}>
            {showId ? (
              <>Edit SoW <span style={{ fontWeight: 'bold', color: 'blue' }}>#{sow.id}</span></>
            ) : (
              <>
                Edit SoW <span style={{ fontWeight: 'bold', color: 'blue' }}>#ID</span>
              </>
            )}
            </h2>

            <div className="form__action-buttons">
                <button
                    className="icon-button"
                    title="Generate Word"
                    onClick={onGenerateWordClicked}
                >
                    <FontAwesomeIcon icon={faFileWord} />
                </button>
                <button
                    className="icon-button"
                    title="Save"
                    onClick={onSaveSowClicked}
                    disabled={!canSave}
                >
                    <FontAwesomeIcon icon={faSave} />
                </button>
                {/* Assuming you might have a delete button similar to Note */}
                {deleteButton}
            </div>
        </div>

        {sow.type === 'Lift and shift' && (
            <>
                 <div className="section__2">

          <div className="form__input-container-vm--lz">
            <label className="form__label">
              Virtual Machines:
            </label>  
            <div className="number-picker">
              <button
                className="number-picker__button_minus"
                onClick={() => setVms(Math.max(0, parseInt(vms, 10) - 1))}
              >
                -
              </button>
              <input
                className={`form__input ${!vms ? "form__input--incomplete" : ""} small-input`}
                id="vms"
                name="vms"
                min="0"
                value={vms}
                onChange={(e) => setVms(e.target.value)}
              />
              <button
                className="number-picker__button_plus"
                onClick={() => setVms(parseInt(vms, 10) + 1)}
              >
                +
              </button>
            </div>
          </div>


          <div className="form__input-container-vm--lz">
            <label className="form__label">
              Landing Zones:
            </label>

            <div className="number-picker">
              <button
                className="number-picker__button_minus"
                onClick={() => setLandingZones(Math.max(0, parseInt(landing_zones, 10) - 1))}
              >
                -
              </button>
              <input
                className={`form__input ${!landing_zones ? "form__input--incomplete" : ""} small-input`}
                id="landingZones"
                name="landingZones"
                min="0"
                value={landing_zones}
                onChange={(e) => setLandingZones(e.target.value)}
              />
              <button
                className="number-picker__button_plus"
                onClick={() => setLandingZones(parseInt(landing_zones, 10) + 1)}
              >
                +
              </button>
            </div>
          </div>

      </div>


{/* section 3 */}

<h3 style={{  marginBottom: '20px' }}>
  Hourly Rate:</h3>
    <div className="section__3">
      
      <div className="form__input-container">
        <label className="form__label" htmlFor="engineerRate">
          Engineer:
        </label>
        <input
          className="form__input"
          type="text"
          value={engineer_hourly}
          onChange={(e) => setEngineerRate(e.target.value)}
        />
        <div class="slidecontainer">
          <input
            class="slider"
            id="engineer_hourly"
            name="engineer_hourly"
            type="range"
            min="230"
            max="300"
            value={engineer_hourly}
            onChange={(e) => setEngineerRate(e.target.value)}
          />
        </div>
      </div>

      <div className="form__input-container">
        <label className="form__label" htmlFor="architectRate">
          Architect:
        </label>
        <input
          className="form__input"
          type="text"
          value={architect_hourly}
          onChange={(e) => setArchitectRate(e.target.value)}
        />
        <div class="slidecontainer">
          <input
            class="slider"
            id="architect_hourly"
            name="architect_hourly"
            type="range"
            min="300"
            max="400"
            value={architect_hourly}
            onChange={(e) => setArchitectRate(e.target.value)}
          />
        </div>
      </div>

      <div className="form__input-container">
        <label className="form__label" htmlFor="pmRate">
          Project Manager:
        </label>
        <input
          className="form__input"
          type="text"
          value={pm_hourly}
          onChange={(e) => setPmRate(e.target.value)}
        />
        <div class="slidecontainer">
          <input
            class="slider"
            id="pm_hourly"
            name="pm_hourly"
            type="range"
            min="200"
            max="250"
            value={pm_hourly}
            onChange={(e) => setPmRate(e.target.value)}
          />
        </div>
      </div>

    </div>

            </>
        )}

        {sow.type === 'Arc as a Service' && (
            <>
                <div className="section__2">
        
        <label className="form__label" htmlFor="hours">
          Hours:
        </label>
        <select
          className={`form__input ${!(hours === 10 || hours === 20) ? "form__input--incomplete" : ""}`}
          id="hours"
          name="hours"
          value={hours}
          onChange={(e) => setHours(Number(e.target.value))}
        >
          <option value={10}>10</option>
          <option value={20}>20</option>
        </select>

</div>

      <div className="section__3">

        <div className="form__input-container">
          <label className="form__label" htmlFor="months">
            Months:
          </label>
            <input
              className="form__input"
              type="text"
              value={months}
              onChange={(e) => setMonths(e.target.value)}
            />
            <div class="slidecontainer">
              <input
                className="slider"
                id="months"
                name="months"
                type="range"
                min="6"
                max="24"
                step="1"
                value={months}
                onChange={(e) => setMonths(e.target.value)}
              />
            </div>
          </div>
        


        <div className="form__input-container">
          <label className="form__label" htmlFor="architectRate">
            Architect Hourly Rate:
          </label>
          <input
            className="form__input"
            type="text"
            value={architect_hourly}
            onChange={(e) => setArchitectRate(e.target.value)}
          />
          <div class="slidecontainer">
            <input
              className="slider"
              id="architect_hourly"
              name="architect_hourly"
              type="range"
              min="300"
              max="400"
              value={architect_hourly}
              onChange={(e) => setArchitectRate(e.target.value)}
            />
          </div>
        </div>
  
      </div>
            </>
        )}
    </form>
</>

    )
        
    return content
}
        
export default EditSoWform