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
        <div className="form__title-row">
            <h2>Edit SoW #{sow.id}</h2>
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
                <label className="form__label" htmlFor="sow-vms">
                    Virtual Machines:</label>
                <input
                    className="form__input"
                    id="sow-vms"
                    name="vms"
                    type="text"
                    autoComplete="off"
                    value={vms}
                    onChange={onVmsChanged}
                />

                <label className="form__label" htmlFor="sow-landing-zones">
                    Landing Zones:</label>
                <input
                    className="form__input"
                    id="sow-landing-zones"
                    name="landing_zones"
                    type="text"
                    autoComplete="off"
                    value={landing_zones}
                    onChange={onLandingZonesChanged}
                />
            </>
        )}

        {sow.type === 'Arc as a Service' && (
            <>
                <label className="form__label" htmlFor="sow-hours">
                    Hours:</label>
                <input
                    className="form__input"
                    id="sow-hours"
                    name="hours"
                    type="text"
                    autoComplete="off"
                    value={hours}
                    onChange={onHoursChanged}
                />

                <label className="form__label" htmlFor="sow-months">
                    Months:</label>
                <input
                    className="form__input"
                    id="sow-months"
                    name="months"
                    type="text"
                    autoComplete="off"
                    value={months}
                    onChange={onMonthsChanged}
                />
            </>
        )}
    </form>
</>

    )
        
    return content
}
        
export default EditSoWform