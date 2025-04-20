import React from 'react'
import PagesHeader from '../components/PagesHeader'

export default function CategoryList() {
  return (
    <div className='flex flex-col h-[150vh]'>
      <PagesHeader
        title="Catégories" // or "Utilisateurs"
        breadcrumbs={[
          { label: 'Tableau de bord', link: '/dashboard' }, // "Dashboard" is also often used directly in French
          { label: 'Catégories', link: '/dashboard/categories' }, // or "Utilisateurs"
          { label: 'Créer' }
        ]}
      />

    </div>
  )
}
