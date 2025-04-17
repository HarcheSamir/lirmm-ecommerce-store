import {
    PiPackageDuotone,
    PiShoppingCartDuotone,
    PiUserCircleDuotone,
    PiQuestion,
    PiCalendarBlank,
    PiCaretUp,
    PiCaretDown,
} from 'react-icons/pi';
import React, { useState, useEffect } from 'react';
import { FaDotCircle } from "react-icons/fa";
import useLayoutStore from '../store/layoutStore';
import { IoMdClose } from "react-icons/io";
import ReactDOM from 'react-dom';

const navigationItems = [
    {
        name: 'Products',
        icon: PiPackageDuotone,
        children: [
            { name: 'List', path: '/products' },
            { name: 'Edit', path: '/products/edit' },
            { name: 'Create', path: '/products/create' },
        ],
    },
    {
        name: 'Orders',
        icon: PiShoppingCartDuotone,
        children: [
            { name: 'List', path: '/orders' },
            { name: 'Edit', path: '/orders/edit' },
            { name: 'Create', path: '/orders/create' },
            { name: 'Details', path: '/orders/details' },
        ],
    },
    {
        name: 'Account',
        icon: PiUserCircleDuotone,
        children: [
            { name: 'Settings', path: '/account/settings' },
            { name: 'Activity log', path: '/account/activity' },
            { name: 'Roles & Permissions', path: '/account/roles' },
            { name: 'Pricing', path: '/account/pricing' },
        ],
    },
    {
        name: 'Help Center',
        icon: PiQuestion,
        path: '/help',
    },
    {
        name: 'Calendar',
        icon: PiCalendarBlank,
        path: '/calendar',
    },
];

const PopupMenu = ({ children, isOpen, targetRef, onMouseEnter, onMouseLeave }) => {
    const [position, setPosition] = useState({ top: 0, left: 0 });

    React.useEffect(() => {
        if (isOpen && targetRef.current) {
            const rect = targetRef.current.getBoundingClientRect();
            // Basic positioning - might need adjustment based on scroll / complex layouts
            setPosition({
                top: rect.top,
                left: rect.right + 8, // 8px offset (equivalent to ml-2)
            });
        }
    }, [isOpen, targetRef]);

    if (!isOpen) return null;

    return ReactDOM.createPortal(
        <div
            className="fixed z-50 bg-white rounded-lg shadow-lg border border-gray-200 min-w-40 py-2"
            style={{ top: position.top, left: position.left }}
            onMouseEnter={onMouseEnter} // Pass through handler
            onMouseLeave={onMouseLeave} // Pass through handler
        >
            {children}
        </div>,
        document.body
    );
};


// Updated SidebarItem
const SidebarItem = ({ item, isActive, isExpanded, onClick, onSubItemClick, activeSubItem, miniSidebar }) => {
    const hasChildren = item.children && item.children.length > 0;
    const [showPopup, setShowPopup] = useState(false); // State controls popup visibility
    const itemRef = React.useRef(null);
    const hidePopupTimer = React.useRef(null); // Ref to store the timeout ID

    // Function to show the popup and clear any pending hide timers
    const handleMouseEnter = () => {
        clearTimeout(hidePopupTimer.current); // Clear any pending timer to hide
        if (miniSidebar && hasChildren) {
            setShowPopup(true);
        }
    };

    // Function to start a timer to hide the popup
    const handleMouseLeave = () => {
        // Set a timer to hide the popup after a short delay (e.g., 150ms)
        hidePopupTimer.current = setTimeout(() => {
            setShowPopup(false);
        }, 150); // Adjust delay as needed
    };

    // Clean up timer on unmount
    useEffect(() => {
        return () => {
            clearTimeout(hidePopupTimer.current);
        };
    }, []);

    return (
        <div
            className="relative" // No background color needed here now unless for debugging
            ref={itemRef}
            onMouseEnter={handleMouseEnter} // Use unified handler for trigger
            onMouseLeave={handleMouseLeave} // Use unified handler for trigger
        >
            {/* Trigger Item */}
            <div
                onClick={() => onClick(item.name)}
                 // Note: No background set here, apply container relative if needed for positioning ref
                className={`flex items-center justify-between p-2.5 rounded-lg cursor-pointer group ${
                    (isActive && !hasChildren) || (isActive && hasChildren && !miniSidebar) // Adjusted active state logic for clarity
                        ? 'bg-blue-100 text-primary font-medium'
                        : 'text-gray-700 hover:bg-gray-100'
                    } ${miniSidebar ? 'justify-center' : ''}`}
            >
                 <div className={`flex items-center ${miniSidebar ? 'justify-center w-full ' : ''}`}>
                    <item.icon className={`w-5 h-5 ${miniSidebar ? 'mr-0 w-6 h-6' : 'mr-3'} flex-shrink-0 ${
                        (isActive && activeSubItem === null) || (isActive && !hasChildren && !miniSidebar) // Refined active icon color logic
                        ? 'text-blue-500' : 'text-gray-500 group-hover:text-gray-700'
                        }`}
                    />
                    {!miniSidebar && <span className="text-sm">{item.name}</span>}
                </div>
                {hasChildren && !miniSidebar && (
                    isExpanded ? <PiCaretUp className="w-4 h-4 text-gray-500" /> : <PiCaretDown className="w-4 h-4 text-gray-500" />
                )}
            </div>

            {/* Mini Sidebar Popup */}
            {miniSidebar && hasChildren && (
                <PopupMenu
                    isOpen={showPopup}
                    targetRef={itemRef}
                    onMouseEnter={handleMouseEnter} // Keep popup open if mouse enters it
                    onMouseLeave={handleMouseLeave} // Start hide timer if mouse leaves popup
                >
                    <div className="font-medium text-sm px-3 py-2 border-b border-gray-100">{item.name}</div>
                    <div className="mt-1">
                        {item.children.map((child) => (
                            <div
                                key={child.name}
                                onClick={(e) => {
                                    e.stopPropagation();
                                    onSubItemClick(item.name, child.name);
                                    setShowPopup(false); // Hide popup after click
                                }}
                                className={`flex items-center py-1.5 px-3 cursor-pointer hover:bg-gray-100 ${
                                    activeSubItem === child.name && isActive
                                    ? 'text-primary font-medium' : 'text-gray-600'
                                }`}
                            >
                                <span className={`w-1.5 h-1.5 rounded-full mr-2 ${
                                    activeSubItem === child.name && isActive
                                    ? 'bg-primary' : 'bg-gray-400'
                                    }`}></span>
                                <span className="text-sm">{child.name}</span>
                            </div>
                        ))}
                    </div>
                </PopupMenu>
            )}

            {/* Regular Expanded Sub Items for normal sidebar */}
            {hasChildren && !miniSidebar && (
                <div className={`grid transition-all duration-300 ease-in-out ${isExpanded ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'}`}>
                    <div className="overflow-hidden pl-6 space-y-1">
                        {item.children.map((child) => (
                            <SidebarSubItem
                                key={child.name}
                                item={child}
                                isActive={activeSubItem === child.name && isActive}
                                onClick={() => onSubItemClick(item.name, child.name)}
                            />
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

const SidebarSubItem = ({ item, isActive, onClick }) => {
    return (
        <div
            onClick={onClick}
            className={`flex items-center py-1.5 px-2.5 rounded-md cursor-pointer group ${isActive ? 'text-primary font-medium' : 'text-gray-600 hover:text-gray-900'}`}
        >
            <span className={`w-1.5 h-1.5 rounded-full mr-3 ${isActive ? 'bg-primary' : 'bg-gray-400 group-hover:bg-gray-500'}`}></span>
            <span className="text-sm">{item.name}</span>
        </div>
    );
};

// --- Main Sidebar Component ---

export default function Sidebar() {
    // State to track expanded sections
    const [expanded, setExpanded] = useState({
        Products: true,
        Orders: true,
        Account: true,
        'Help Center': false,
    });
    const { sidebar, switchSidebar, miniSidebar } = useLayoutStore();

    const [activeItem, setActiveItem] = useState('Orders'); // Parent name
    const [activeSubItem, setActiveSubItem] = useState('List'); // Child name

    const handleToggleExpand = (itemName) => {
        setExpanded(prev => ({
            ...prev,
            [itemName]: !prev[itemName]
        }));
    };

    const handleItemClick = (itemName) => {
        const item = navigationItems.find(i => i.name === itemName);
        const hasChildren = item?.children && item.children.length > 0;

        if (hasChildren) {
            if (!miniSidebar) {
                // If in normal mode and item has children, toggle expansion
                handleToggleExpand(itemName);
            } else {
                // In mini mode, clicking a parent item with children does nothing
                // (since hovering handles showing children)
            }
        } else {
            // If the item has NO children, clicking it sets it as active
            setActiveItem(itemName);
            setActiveSubItem(null); // Clear any active sub-item
            console.log(`Navigating to ${item?.path || '#'}`);
        }
    };

    const handleSubItemClick = (parentName, childName) => {
        // Clicking a sub-item ALWAYS sets the parent and child as active
        setActiveItem(parentName);
        setActiveSubItem(childName);

        // If the parent wasn't expanded in normal mode, expand it now
        if (!miniSidebar && !expanded[parentName]) {
            handleToggleExpand(parentName);
        }

        const parentItem = navigationItems.find(i => i.name === parentName);
        const childItem = parentItem?.children.find(c => c.name === childName);
        console.log(`Navigating to ${childItem?.path || '#'}`);
    };

    return (
        <div className={`font-semibold shrink-0 h-screen bg-white border-r overflow-hidden border-gray-200 flex flex-col duration-200 w-0 ${miniSidebar ? 'lg:w-16' : 'lg:w-64'} ${sidebar ? 'w-64 z-50' : 'w-0'}`}>
            {/* Logo */}
            <div className={`p-4 pt-5 pb-3 flex items-center mb-4 ${miniSidebar ? 'justify-center' : ''}`}>
                <div className="bg-primary p-1 rounded-lg">
                    <FaDotCircle className="text-white text-l" />
                </div>
                {!miniSidebar && (
                    <span className="text-xl ml-2 font-bold text-gray-800">Ec<span className='text-primary'>o</span>m</span>
                )}
            </div>

            {/* Navigation */}
            <nav

                className={`
          flex-grow ${miniSidebar ? ' ml-2 ' : 'pl-3'}  space-y-1 overflow-y-scroll 
          scrollbar-thin scrollbar-thumb-transparent scrollbar-track-transparent
          hover:scrollbar-thumb-gray-400 scrollbar-thumb-rounded-full
        `}>
                {navigationItems.map((item) => (
                    <SidebarItem
                        key={item.name}
                        item={item}
                        isActive={activeItem === item.name}
                        isExpanded={!!expanded[item.name]}
                        onClick={handleItemClick}
                        onSubItemClick={handleSubItemClick}
                        activeSubItem={activeItem === item.name ? activeSubItem : null}
                        miniSidebar={miniSidebar}
                    />
                ))}
            </nav>

            {/* Optional Footer */}
        </div>
    );
}