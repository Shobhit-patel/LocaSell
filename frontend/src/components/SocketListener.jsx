import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addNotification } from "../reducers/features/notification/notificationSlice";
import { socket } from '../socket/socket.js';

const SocketListener = () => {
    const dispatch = useDispatch();
    const user = useSelector((state) => state.signup.user || state.login.user);

    useEffect(() => {
        if (!user?._id) return;

        socket.connect();

        socket.emit("register-user", user?._id);
        socket.on("notification", (data) => {
            dispatch(
                addNotification({
                    ...data,
                    createdAt: new Date().toISOString(),
                })
            );
        });

        return () => {
            socket.off("notification");
        };
    }, [user?._id, dispatch]);
    return null
}

export default SocketListener
