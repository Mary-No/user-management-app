import React from "react";

type User = {
    id: number;
    email: string;
    name: string;
    status: boolean;
    lastLogin: string | null;
};

type Props = {
    users: User[];
    setSelectedIds: React.Dispatch<React.SetStateAction<number[]>>
    selectedIds: number[]
};

export const UsersTable = ({users, setSelectedIds, selectedIds}: Props) => {


    const toggleSelectAll = () => {
        if (selectedIds.length === users.length) {
            setSelectedIds([]);
        } else {
            setSelectedIds(users.map((u) => u.id));
        }
    };

    const toggleSelectOne = (id: number) => {
        if (selectedIds.includes(id)) {
            setSelectedIds(selectedIds.filter((sid) => sid !== id));
        } else {
            setSelectedIds([...selectedIds, id]);
        }
    };

    const formatDate = (dateStr: string | null) => {
        if (!dateStr) return 'Never';
        const date = new Date(dateStr);
        return date.toLocaleString();
    };

    return (
        <div className="table-responsive">
            <table className="table table-striped align-middle">
                <thead>
                <tr>
                    <th scope="col">
                        <input
                            type="checkbox"
                            onChange={toggleSelectAll}
                            checked={selectedIds.length === users.length && users.length > 0}
                            aria-label="Select all users"
                        />
                    </th>
                    <th scope="col">Name</th>
                    <th scope="col">Email</th>
                    <th scope="col">Status</th>
                    <th scope="col">Last Login</th>
                </tr>
                </thead>
                <tbody>
                {users.map(({id, name, email, status, lastLogin}) => (
                    <tr key={id}>
                        <td>
                            <input
                                type="checkbox"
                                checked={selectedIds.includes(id)}
                                onChange={() => toggleSelectOne(id)}
                                aria-label={`Select user ${name}`}
                            />
                        </td>
                        <td>{name}</td>
                        <td>{email}</td>
                        <td>
                <span className={`badge ${status ? 'bg-success' : 'bg-danger'}`}>
                  {status ? 'Active' : 'Blocked'}
                </span>
                        </td>
                        <td>{formatDate(lastLogin)}</td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
};
