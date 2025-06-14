import { Link } from 'react-router-dom';
import { FiChevronRight } from 'react-icons/fi';

export default function MegaMenu({ parentCategory, isOpen, anchorRect, headerRect, onMouseEnter, onMouseLeave }) {
    if (!isOpen || !anchorRect || !headerRect) {
        return null;
    }

    // Calculate position relative to the header, not the viewport
    const top = anchorRect.bottom - headerRect.top;
    const left = anchorRect.left - headerRect.left;

    return (
        <div
            className={`absolute z-50 transition-all duration-200 ease-in-out ${isOpen ? 'opacity-100 visible translate-y-0' : 'opacity-0 invisible -translate-y-2'}`}
            style={{ top: `${top}px`, left: `${left}px` }}
            onMouseEnter={onMouseEnter}
            onMouseLeave={onMouseLeave}
        >
            <div className="bg-white rounded-lg shadow-xl border border-gray-100 p-4 mt-2 min-w-[220px]">
                <ul className="space-y-1">
                    {parentCategory.children.map(child => (
                        <li key={child.id}>
                            <Link
                                to={`/category/${child.slug}`}
                                className="flex items-center justify-between p-2 rounded-md text-sm text-gray-700 hover:bg-gray-100 hover:text-primary group/link"
                            >
                                <span>{child.name}</span>
                                <FiChevronRight className="opacity-0 group-hover/link:opacity-100 transition-opacity" />
                            </Link>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
}