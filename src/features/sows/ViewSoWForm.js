import { useGetSoWsQuery } from "./sowsApiSlice"; 
import { Link } from 'react-router-dom';

const SOWCard = ({ sowId }) => {

    const { sow } = useGetSoWsQuery("sowsList", {
        selectFromResult: ({ data }) => ({
            sow: data?.entities[sowId]
        }),
    })

    if (!sow) {
        return <h3>No SoW found with ID {sowId}</h3>;
    }

    if (sow) {
        return (
            <div className="sow-card-grid">
                <div className="sow-card">
                    <div className="sow-card-header">
                        <h3>Company: {sow.name}</h3>
                    </div>
                    
                    {sow.type === 'Lift and shift' && 
                    <>
                        Virtual Machines: {sow.vms} <br /> 
                        Landing Zones: {sow.landing_zones} <br />
                        Engineer Hourly Rate: {sow.engineer_hourly} <br />
                        Architect Hourly Rate: {sow.architect_hourly} <br />
                        PM Hourly Rate: {sow.pm_hourly} <br />
                    </>
                    }

                    {sow.type === 'Arc as a Service' && 
                    <>
                        Hours: {sow.hours} <br /> 
                        Months: {sow.months} <br />
                        Architect Hourly Rate: {sow.architect_hourly} <br />

                    </>
                    }

                    <div className="sow-card-footer">
                        <p>Assigned To: {sow.username}</p>
                    </div>
                    
                    <Link to={`/dash/sows/${sowId}`}>View Details</Link>
                </div>
            </div>

        );
    } else return (
        <h1>Not It</h1>
    );
    
}

export default SOWCard;
