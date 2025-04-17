import { create } from 'zustand';

const useLayoutStore = create((set, get) => ({
    sidebar: false,
    miniSidebar:false,
    switchSidebar: () => {
        set({ sidebar: !get().sidebar });
        console.log(get().sidebar)
    },
    switchMiniSidebar: () => {
        set({ miniSidebar: !get().miniSidebar });
        console.log(get().miniSidebar)
    },
}));

export default useLayoutStore;