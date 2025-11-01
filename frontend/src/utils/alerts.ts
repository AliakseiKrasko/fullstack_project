import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
import toast from 'react-hot-toast'

const MySwal = withReactContent(Swal)

/* ⚠️ Подтверждение действий (delete, logout и т.д.) */
export const confirmAction = async (message: string, title = 'Are you sure?') => {
    const result = await MySwal.fire({
        title,
        text: message,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Yes',
        cancelButtonText: 'Cancel',
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
    })
    return result.isConfirmed
}

/* ✅ Быстрые уведомления */
export const notifySuccess = (msg: string) => toast.success(msg)
export const notifyError = (msg: string) => toast.error(msg)
export const notifyInfo = (msg: string) => toast(msg)

export const showSuccessModal = (message: string) => {
    return MySwal.fire({
        icon: 'success',
        title: 'Success!',
        text: message,
        showConfirmButton: false,
        timer: 2000,
        timerProgressBar: true,
    })
}