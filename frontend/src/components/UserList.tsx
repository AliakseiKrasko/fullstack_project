import { useGetUsersQuery } from '../services/usersApi'
import { UserItem } from './UserItem'

export const UserList = () => {
    const { data: users, isLoading, error } = useGetUsersQuery()

    if (isLoading) return <div className="loading">Loading...</div>

    if (error) {
        return (
            <div className="user-list">
                <h2>Users</h2>
                <div className="error">Error loading users. Please try again.</div>
            </div>
        )
    }

    return (
        <div className="user-list">
            <h2>Users ({users?.length || 0})</h2>
            {!users || users.length === 0 ? (
                <p className="no-users">No users found</p>
            ) : (
                users.map((user) => <UserItem key={user.id} user={user} />)
            )}
        </div>
    )
}