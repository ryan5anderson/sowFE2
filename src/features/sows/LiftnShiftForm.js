import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSave, faCalculator, faCheck, faTimes } from "@fortawesome/free-solid-svg-icons";
import { useAddNewSoWMutation } from "./sowsApiSlice";
import CPQCalcForm from "../cpq/cpqCalcForm";
import TotalPrice from "../cpq/totalPrice";




const NewLiftnShiftForm = ({ users }) => {

  const [addNewSoW, {
    isLoading,
    isSuccess,
  }] = useAddNewSoWMutation();

  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [vms, setVms] = useState(1);
  const [landing_zones, setLandingZones] = useState(1);
  const [userId, setUserId] = useState('');
  const [engineer_hourly, setEngineerRate] = useState(271);
  const [architect_hourly, setArchitectRate] = useState(345);
  const [pm_hourly, setPmRate] = useState(240);
  const type = "Lift and shift";
  const [showPopup, setShowPopup] = useState(false);

  useEffect(() => {
    if (isSuccess) {
        // Reset form and navigate to desired page
        setName('');
        setVms('');
        setLandingZones('');
        setUserId('');
        setEngineerRate('');
        setArchitectRate('');
        setPmRate('');
        navigate('/dash');  // Update the path accordingly
    }
  }, [isSuccess, navigate]);

  const canSave = [name, vms, landing_zones, userId].every(Boolean) && !isLoading;


  const handleSaveClick = (e) => {
    e.preventDefault(); 

    if (canSave) {
      setShowPopup(true);
    }

    
  };

  const handleConfirm = async () => {
    setShowPopup(false); // Close the popup
    try {
      await addNewSoW({
        user: userId,
        name,
        vms,
        landing_zones,
        type,
        engineer_hourly,
        architect_hourly,
        pm_hourly
      });
  
      // Send email
      const email = prompt('Please enter your email address:');
      if (email) {
        const response = await fetch('http://localhost:3500/sendEmail', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            email,
            formData: {
              user: userId,
              name,
              vms,
              landing_zones,
              type,
              engineer_hourly,
              architect_hourly,
              pm_hourly
            }
          })
        });
  
        if (response.ok) {
          alert('Email sent successfully!');
        } else {
          alert('Error sending email');
        }
      }
    } catch (error) {
      console.error('Error saving SoW: ', error);
    }
  };
  

  const handleCancel = async () => {
    setShowPopup(false); 
    try {
      await addNewSoW({
        user: userId,
        name,
        vms,
        landing_zones,
        type,
        engineer_hourly,
        architect_hourly,
        pm_hourly
      });
    } catch (error) {
      console.error('Error saving SoW: ', error);
    }
  };
  


    const options = users.map(user => {
        return (
            <option
                key={user.id}
                value={user.id}
            > {user.username}</option >
        )
    })

    const onUserIdChanged = e => setUserId(e.target.value)

    const [displayValues, setDisplayValues] = useState(false);

  
  const formValues = {
    vms,
    landing_zones,
    engineer_hourly,
    architect_hourly,
    pm_hourly,
    type,
  };

  const [isFullPage, setIsFullPage] = useState(false);

  const toggleDisplayValues = () => {
    setDisplayValues(!displayValues);
    setIsFullPage(!isFullPage); // Toggle the state
  };

  

  const content = (

<div className="form-container">
  <form className="form" onSubmit={handleSaveClick}>

      <div className="newSoW-title-row">

      <h2>Lift and Shift</h2>

      </div>


{/* section 1 */}


      <div className="section_1">
        <h3>
          Company Name:
        </h3>
        
          <input
            className={`form__input ${!name ? "form__input--incomplete" : ""}`}
            id="name"
            name="name"
            type="text"
            autoComplete="off"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        
      </div>


{/* section 2 */}

      
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

  


{/* section 4 */}

    <div className="section__4">
      <h3>
        Assigned To:
      </h3>
      <select
        id="username"
        name="username"
        className="form__select"
        value={userId}
        onChange={onUserIdChanged}
      >
        <option value="">Select User</option> 
        {options}
      </select>
    </div>

    <div>
      <TotalPrice values={formValues} type={type} />
    </div>


    <div>
      <div className="form__action-buttons-save">

        <button
          className="icon-button"
          title="Save"
          disabled={!canSave}
          onClick={handleSaveClick}
        >
          <FontAwesomeIcon icon={faSave} />
        </button>

        {showPopup && (
        <div>
          <div className="popup-title">
            <p>Do you want to send this data to an email?</p>
            <div className="popup-buttons">
            <button 
              onClick={handleConfirm}
              className="icon-button"
            >
              <FontAwesomeIcon icon={faCheck} className="fa-check"/>
            </button>

            <button 
              onClick={handleCancel}
              className="icon-button"
            >
              <FontAwesomeIcon icon={faTimes} className="fa-times"/>
            </button>
            </div>
          </div>
        </div>
      )}


      </div>
    </div>
      

  </form>


{/* CPQ */}  

    <div>

      <button
        className="icon-button"
        title="Display Form Values"
        onClick={toggleDisplayValues}
      >
        <FontAwesomeIcon icon={faCalculator} />
      </button>
      {isFullPage ? (
        <div className="full-page">
          <button
            className="exit-fullscreen"
            title="Exit Full Screen"
            onClick={toggleDisplayValues}
          >
            <FontAwesomeIcon icon={faCalculator} />
          </button>
          <div className="form-values-cpq">
            <CPQCalcForm values={formValues} type={type} />
          </div>
        </div>
      ) : (
        <div className="form-values-cpq">
          {displayValues && <CPQCalcForm values={formValues} type={type} />}
        </div>
      )}

    </div>
    


    


</div>
)

  return content
}

export default NewLiftnShiftForm;
