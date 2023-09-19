import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSave, faCalculator, faTimes, faCheck } from "@fortawesome/free-solid-svg-icons";
import { useAddNewSoWMutation } from "./sowsApiSlice";
import CPQCalcForm from "../cpq/cpqCalcForm";
import TotalPrice from "../cpq/totalPrice";

const NewArcasServiceForm = ({ users }) => {
    
    const [addNewSoW, {
        isLoading,
        isSuccess,
      }] = useAddNewSoWMutation();
    
      const navigate = useNavigate();

      const [name, setName] = useState('');
      const [hours, setHours] = useState('10');
      const [months, setMonths] = useState('6');
      const [architect_hourly, setArchitectRate] = useState(345);
      const [userId, setUserId] = useState('');
      const type = "Arc as a Service";
      const [showPopup, setShowPopup] = useState(false);
      const [isFullPage, setIsFullPage] = useState(false);

      useEffect(() => {
        if (isSuccess) {
            // Reset form and navigate to desired page
            setName('');
            setHours('');
            setMonths('');
            setUserId('');
            setArchitectRate('');
            navigate('/dash');  // Update the path accordingly
        }
      }, [isSuccess, navigate]);

      const canSave = [name, hours, months, architect_hourly,  userId].every(Boolean) && !isLoading;

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
                  type,
                  months,
                  hours,
                  architect_hourly,
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
                  type,
                  months,
                  hours,
                  architect_hourly,
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
                  type,
                  months,
                  hours,
                  architect_hourly,
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

        const toggleDisplayValues = () => {
          setDisplayValues(!displayValues);
          setIsFullPage(!isFullPage); // Toggle the state
        };

        const formValues = {
          hours, 
          months,
          architect_hourly,
          type,
        };

        const content = (
          <div className="form-container">
            <form className="form" onSubmit={handleSaveClick}>

              <div className="newSoW-title-row">

                <h2>New Architect as a Service</h2>
            
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

          return content;
        }
 export default NewArcasServiceForm;   


