import NewLiftnShiftForm from './LiftnShiftForm'
import { useGetUsersQuery } from '../users/usersApiSlice'
import PulseLoader from 'react-spinners/PulseLoader'
import useTitle from '../../hooks/useTitle'

const NewLiftnShift = () => {
  useTitle('SOW: New Lift and Shift')

  const { users } = useGetUsersQuery("usersList", {
    selectFromResult: ({ data }) => ({
        users: data?.ids.map(id => data?.entities[id])
    }),
  })

  if (!users?.length) return <PulseLoader color={"#FFF"} />

  const content = (
    <>
     <NewLiftnShiftForm users={users} /> 
    </>
  )
  
  return content

}
export default NewLiftnShift