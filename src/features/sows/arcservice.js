import NewArcasServiceForm from './ArcServiceForm'
import { useGetUsersQuery } from '../users/usersApiSlice'
import PulseLoader from 'react-spinners/PulseLoader'
import useTitle from '../../hooks/useTitle'


const NewArcasService = () => {

  useTitle('SOW: New Arc as Service')

  const { users } = useGetUsersQuery("usersList", {
    selectFromResult: ({ data }) => ({
        users: data?.ids.map(id => data?.entities[id])
    }),
  })

  if (!users?.length) return <PulseLoader color={"#FFF"} />

  const content = <NewArcasServiceForm users={users} />
  
  return content

}

export default NewArcasService;
