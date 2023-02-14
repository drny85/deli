import { ORDER_STATUS } from '../redux/consumer/ordersSlide';

export const STATUS_NAME = (status: ORDER_STATUS) => {
    switch (status) {
        case ORDER_STATUS.new:
            return 'New';
        case ORDER_STATUS.delivered:
            return 'Delivered';
        case ORDER_STATUS.marked_ready_for_delivery:
            return 'Ready For Delivery';
        case ORDER_STATUS.in_progress:
            return 'In Progress';
        case ORDER_STATUS.cancelled:
            return 'Cancelled';
        case ORDER_STATUS.marked_ready_for_pickup:
            return 'Ready For Pickup';
        case ORDER_STATUS.accepted_by_driver:
            return 'Accepted by Driver';
        case ORDER_STATUS.picked_up_by_driver:
            return 'Picked Up By Driver';
        case ORDER_STATUS.picked_up_by_client:
            return 'Picked Up By Client';
        default:
            return status;
    }
};
