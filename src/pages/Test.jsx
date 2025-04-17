import React from 'react'

export default function Test() {
    return (
        <div className='flex gap-4'>
            <div className='h-80 w-16 bg-green-500 overflow-y-scroll  overflow-x-visible'>
                <div className='bg-red-500 w-40 h-4 ' />
                <div className='h-[50rem] m-1 bg-blue-500 pt-4'>
                    blue
                </div>
            </div>

            <div class="relative">
                <div class="h-80 w-16 bg-green-500 overflow-y-scroll">
                    <div class="bg-red-500 w-40 h-4 relative -left-24" />
                    <div class="h-[50rem] m-1 bg-blue-500 pt-4">blue</div>
                </div>
            </div>


        </div>
    )
}
