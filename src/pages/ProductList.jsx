import React from 'react'
import PagesHeader from '../components/PagesHeader'

export default function ProductList() {
  return (
    <div className='flex flex-col h-[150vh]'>
      <PagesHeader
        title="Produits" // or "Utilisateurs"
        breadcrumbs={[
          { label: 'Tableau de bord', link: '/dashboard' }, // "Dashboard" is also often used directly in French
          { label: 'Produits', link: '/dashboard/products' }, // or "Utilisateurs"
          { label: 'Liste' }
        ]}
      />

    </div>
  )
}
