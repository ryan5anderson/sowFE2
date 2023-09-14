import { useParams } from 'react-router-dom'
import { useGetUsersQuery } from '../users/usersApiSlice'
import { useGetSoWsQuery } from './sowsApiSlice'
import useAuth from '../../hooks/useAuth'
import PulseLoader from 'react-spinners/PulseLoader'
import useTitle from '../../hooks/useTitle'
import EditSoWForm from './EditSoWForm'

const EditSoW = () => {
    useTitle('SOW: Edit')

    const { id } = useParams() 

    const { username, isManager, isAdmin } = useAuth()

    const { sow } = useGetSoWsQuery("sowsList", {
        selectFromResult: ({ data }) => ({
            sow: data?.entities[id]
        }),
    })

    const { users } = useGetUsersQuery("usersList", {
        selectFromResult: ({ data }) => ({
            users: data?.ids.map(id => data?.entities[id])
        }),
    })

    if (!sow || !users?.length) return <PulseLoader color={"#FFF"} />

    if (!isManager && !isAdmin) {
        if (sow.username !== username) {
            return <p className="errmsg">No access</p>
        }
    }

    const content = <EditSoWForm sow={sow} users={users} />

    return content

}
export default EditSoW