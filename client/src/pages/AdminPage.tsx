import {useBlockUnblockUsersMutation, useDeleteUsersMutation, useGetUsersQuery} from "../app/api";
import {UsersTable} from "../components/UsersTable";
import {useState} from "react";
import {useToast} from '../components/ToastProvider.tsx';
import {useAppDispatch} from "../app/hooks.ts";
import {logout} from "../features/auth/authSlice.ts";

export const AdminPage = () => {
    const {data: users, isLoading, refetch} = useGetUsersQuery();
    const [selectedIds, setSelectedIds] = useState<number[]>([]);
    const [blockUnblockUsers] = useBlockUnblockUsersMutation();
    const [deleteUsers] = useDeleteUsersMutation();
    const {showToast} = useToast();
    const dispatch = useAppDispatch();

    const handleBlockUnblockClick = async (block: boolean) => {
        try {
            const response = await blockUnblockUsers({userIds: selectedIds, status: !block}).unwrap();
            showToast(response.message, 'success');
            setSelectedIds([]);
            refetch();
        } catch (error: any) {
            const defaultError = block ? 'Block users error' : 'Unblock users error';
            const errorMessage = error?.data?.message || error?.message || defaultError;
            showToast(errorMessage, 'error');
        }
    };
    const handleDeleteClick = async () => {
        try {
            const response = await deleteUsers({userIds: selectedIds}).unwrap();
            showToast(response.message, 'success');
            setSelectedIds([]);
            refetch();
        } catch (error: any) {
            const errorMessage = error?.data?.message || error?.message || "Delete users error";
            showToast(errorMessage, 'error');
        }
    }
    const handleLogoutClick = () => {
        dispatch(logout())
    }
    return (<div className="container my-4">
            <div className="d-flex justify-content-between align-items-center flex-wrap gap-2">
                <div className="btn-group" role="group" aria-label="Admin actions">
                    <button disabled={!selectedIds.length} type="button" onClick={() => handleBlockUnblockClick(true)}
                            className="btn btn-outline-primary">
                        <i className="bi bi-slash-circle me-2"></i>Block
                    </button>
                    <button disabled={!selectedIds.length} type="button" onClick={() => handleBlockUnblockClick(false)}
                            className="btn btn-outline-primary">
                        <i className="bi bi-check-circle me-2"></i>Unblock
                    </button>
                    <button disabled={!selectedIds.length} type="button" onClick={handleDeleteClick}
                            className="btn btn-outline-danger">
                        <i className="bi bi-trash me-2"></i>Delete
                    </button>
                </div>
                <button type="button" onClick={handleLogoutClick} className="btn btn-outline-primary ms-auto">
                    <i className="bi bi-box-arrow-right me-2"></i>Logout
                </button>
            </div>
            <div className="mt-4">
                {isLoading ? (<p>Loading users...</p>) :
                    <UsersTable selectedIds={selectedIds} setSelectedIds={setSelectedIds} users={users || []}/>}
            </div>

        </div>

    )
}