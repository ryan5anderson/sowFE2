import { useGetSoWsQuery } from "./sowsApiSlice"
import SOWCard from "./ViewSoWForm"
import useAuth from "../../hooks/useAuth"
import useTitle from "../../hooks/useTitle"
import PulseLoader from 'react-spinners/PulseLoader'

const ViewSoWs = () => {

  useTitle('SOW: List');

  const { username, isManager, isAdmin } = useAuth()

  const {
      data: sows,
      isLoading,
      isSuccess,
      isError,
      error
  } = useGetSoWsQuery('sowsList', {
      pollingInterval: 15000,
      refetchOnFocus: true,
      refetchOnMountOrArgChange: true
  });

  let content;

  if (isLoading) content = <PulseLoader color={"#FFF"} />;

  if (isError) {
      content = <p className="errmsg">{error?.data?.message}</p>;
  }

  if (isSuccess) {
      const { ids, entities } = sows;

      let filteredIds
        if (isManager || isAdmin) {
            filteredIds = [...ids]
        } else {

          filteredIds = ids.filter(sowId => entities[sowId].username === username);
        }

      const cardContent = filteredIds.map(sowId => <SOWCard key={sowId} sowId={sowId} />);

      content = (
          <div className="sow-card-container">
              {cardContent}
          </div>
      );
  }

  return content;
}

export default ViewSoWs;
