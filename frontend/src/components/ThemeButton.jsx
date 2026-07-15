import { useDispatch, useSelector } from "react-redux";
import { toggleTheme } from "../reducers/features/theme/themeSlice";
import toast from "react-hot-toast";

const ThemeButton = () => {
    const dispatch = useDispatch();
    const theme = useSelector((state) => state.theme.mode);

    return (
        <button onClick={() => dispatch(toggleTheme())} className="py-2 w-5 " >
            {theme === "light" ?
                <img onClick={() => toast.success('Dark mode')} className="w-5 cursor-pointer" src="../../../src/assets/icons/dark.png" alt="" />
                :
                <img onClick={() => toast.success('Light mode')} className="w-5 dark:invert-100 cursor-pointer" src="../../../src/assets/icons/light.png" alt="" />
            }
        </button>
    );
}

export default ThemeButton;