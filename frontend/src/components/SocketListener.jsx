import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addNotification } from "../reducers/features/notification/notificationSlice";
import { socket } from "../socket/socket.js";
import { setOnlineUsers, removeOnlineUser, addOnlineUser } from "../reducers/features/onlineUserSlice";

const SocketListener = () => {
    const dispatch = useDispatch();
    const user = useSelector((state) => state.signup.user || state.login.user);

    useEffect(() => {
        if (!user?._id) return;

        if (!socket.connected) {
            socket.connect();
        }

        socket.emit("register-user", user._id);

        socket.on("notification", (data) => {
            dispatch(
                addNotification({
                    ...data,
                    createdAt: new Date().toISOString(),
                })
            );
        });

        socket.on("online-users", (users) => {
            dispatch(setOnlineUsers(users));
        });

        socket.on("user-status", ({ userId, online }) => {
            if (online) {
                dispatch(addOnlineUser(userId));
            }
            else {
                dispatch(removeOnlineUser(userId));
            }
        });

        return () => {
            socket.off("notification");
            socket.off("online-users");
            socket.off("user-status");
        };

    }, [user?._id, dispatch]);

    return null;
};

export default SocketListener;