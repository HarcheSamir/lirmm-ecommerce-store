import React from 'react';
import { Link } from 'react-router-dom';
import { GoDotFill } from 'react-icons/go';

export default function PagesHeader({
    className,
    title,
    breadcrumbs,
    actionButton
}) {
    return (
        <div className={className + ' w-full flex items-center pb-4 mt-4'}>
            <div className='flex flex-col pl-2'>
                <div className='flex mt-2 gap-2 items-center text-[13px] font-semibold text-zinc-500'>
                    {breadcrumbs.map((crumb, index) => (
                        <React.Fragment key={index}>
                            {index > 0 && <GoDotFill className='text-[8px] text-zinc-300' />}
                            {crumb.link ? (
                                <Link to={crumb.link}>{crumb.label}</Link>
                            ) : (
                                <p>{crumb.label}</p>
                            )}
                        </React.Fragment>
                    ))}
                </div>
                <p className='font-bold text-2xl'>{title}</p>

            </div>
        </div>
    );
};
