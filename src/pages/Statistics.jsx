import React from 'react'
import PagesHeader from '../components/PagesHeader'

export default function Statistics() {
  return (
    <div className='flex flex-col h-[150vh]'>
      <PagesHeader
        title="Analytique" // or "Utilisateurs"
        breadcrumbs={[
          { label: 'Tableau de bord', link: '/dashboard' },
          { label: 'Analytique', link: '/dashboard/' }, // or "Utilisateurs"
        ]}
      />

    </div>
  )
}
