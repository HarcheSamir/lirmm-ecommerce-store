import React, { useRef, useState, useEffect } from 'react';
import PagesHeader from '../components/PagesHeader';
import { HashLink } from 'react-router-hash-link';
import JoditEditor from 'jodit-react';
const options = ['bold', 'italic', 'underline', '|', 'ul', 'ol', '|', 'font', 'fontsize', '|', 'align', '|', 'hr', '|', 'fullsize', 'brush', '|', 'link', '|', 'undo'];
import { useFormWithValidation } from '../hooks/useFormWithValidation'
import { Controller } from 'react-hook-form';
import {
  PiCloudArrowUpDuotone,
  PiXBold,
  PiStackDuotone,
  PiCheckCircleFill,
  PiCircle,
  PiPlus,
  PiTrash
} from "react-icons/pi";

export default function ProductCreate() {
  const config = React.useMemo(() => ({
    readonly: false,
    placeholder: '',
    defaultActionOnPaste: 'insert_as_html',
    defaultLineHeight: 1.5,
    enter: 'div',
    buttons: options,
    buttonsMD: options,
    buttonsSM: options,
    buttonsXS: options,
    statusbar: false,
    toolbarAdaptive: false,
    addNewLine: false,
  }), []);
  const [activeSection, setActiveSection] = useState('');

  const sectionOneRef = useRef(null);
  const sectionTwoRef = useRef(null);
  const sectionThreeRef = useRef(null);
  const sectionFourRef = useRef(null);
  const sectionFiveRef = useRef(null);
  const sectionSixRef = useRef(null);
  const sectionSevenRef = useRef(null);

  const navItems = [
    { label: 'Résumé', id: 'sec1' },
    { label: 'Images', id: 'sec2' },
    { label: 'Catégories', id: 'sec3' },
    { label: 'Attributs', id: 'sec4' },
    { label: 'Variantes', id: 'sec5' },
    { label: 'SEO', id: 'sec6' },
    { label: 'Autre', id: 'sec7' },
  ];

  const [selectedImages, setSelectedImages] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  const fileInputRef = useRef(null);

  const [categories, setCategories] = useState([
    { id: 'cat1', name: 'Électronique', description: 'Technologie . 128 produits', subDescription: 'Gadgets et appareils électroniques' },
    { id: 'cat2', name: 'Maison & Cuisine', description: 'Articles ménagers . 250 produits', subDescription: 'Appareils, ustensiles et décoration' },
    { id: 'cat3', name: 'Vêtements', description: 'Habillement . 500 produits', subDescription: 'Mode homme, femme et enfant' },
    { id: 'cat4', name: 'Livres', description: 'Littérature . 1000+ produits', subDescription: 'Fiction, non-fiction et plus' },
  ]);
  const [selectedCategories, setSelectedCategories] = useState([]);

  const [productAttributes, setProductAttributes] = useState(['Color']);
  const [newAttributeName, setNewAttributeName] = useState('');
  const [variants, setVariants] = useState([]);
  const [currentVariant, setCurrentVariant] = useState({
    sku: '',
    prix: '',
    prixCoutant: '',
    stockQuantity: '',
    lowStockThreshold: '',
    attributs: { colorNom: '', colorHex: '#ffffff' },
  });

  useEffect(() => {
    const observerOptions = {
      root: null,
      rootMargin: '0px 0px -75% 0px',
      threshold: 0,
    };
    const observerCallback = (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setActiveSection(entry.target.id);
        }
      });
    };
    const observer = new IntersectionObserver(observerCallback, observerOptions);
    const sections = navItems.map(item => document.getElementById(item.id));
    sections.forEach((section) => {
      if (section) observer.observe(section);
    });
    return () => {
      sections.forEach((section) => {
        if (section) observer.unobserve(section);
      });
    };
  }, [navItems]);

  const { register, handleSubmit, formState: { errors }, control, setValue } = useFormWithValidation();

  const onSubmit = (data) => {
    const formData = {
      ...data,
      categories: selectedCategories.map(c => c.id),
      images: selectedImages,
      variants: variants.map(v => ({
        attributes: v.attributs,
        price: v.prix,
        costPrice: v.prixCoutant,
        stockQuantity: v.stockQuantity,
        lowStockThreshold: v.lowStockThreshold,
      })),
    };
    console.log('Données Formulaires Soumises:', formData);
  };

  const handleImageSelectClick = () => {
    fileInputRef.current?.click();
  };
  const handleFileChange = (event) => {
    const files = event.target.files;
    if (files) {
      const newFilesArray = Array.from(files);
      const currentFiles = [...selectedImages];
      const filesToAdd = newFilesArray.filter(newFile =>
        !currentFiles.some(existingFile =>
          existingFile.name === newFile.name && existingFile.size === newFile.size
        )
      );
      setSelectedImages(prev => [...prev, ...filesToAdd]);
      const newPreviews = filesToAdd.map(file => ({ file: file, url: URL.createObjectURL(file) }));
      setImagePreviews(prev => [...prev, ...newPreviews]);
      event.target.value = null;
    }
  };
  const handleRemoveImage = (previewUrlToRemove, fileToRemove) => {
    setSelectedImages(prev => prev.filter(file => file !== fileToRemove));
    setImagePreviews(prev => prev.filter(preview => preview.url !== previewUrlToRemove));
    URL.revokeObjectURL(previewUrlToRemove);
  };
  useEffect(() => {
    return () => {
      imagePreviews.forEach(preview => URL.revokeObjectURL(preview.url));
    };
  }, [imagePreviews]);

  const handleCategoryToggle = (category) => {
    setSelectedCategories((prevSelected) => {
      const isSelected = prevSelected.some(c => c.id === category.id);
      if (isSelected) {
        return prevSelected.filter(c => c.id !== category.id);
      } else {
        return [...prevSelected, category];
      }
    });
  };
  const handleRemoveCategoryTag = (categoryToRemove) => {
    setSelectedCategories((prevSelected) =>
      prevSelected.filter(c => c.id !== categoryToRemove.id)
    );
  };

  const normalizeAttributeName = (name) => {
    return name.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().replace(/\s+/g, '');
  };

  const handleAddAttribute = (e) => {
    if (e.key === 'Enter') {
       e.preventDefault();
       const trimmedName = newAttributeName.trim();
       if (trimmedName && !productAttributes.some(attr => attr.toLowerCase() === trimmedName.toLowerCase())) {
         setProductAttributes(prev => [...prev, trimmedName]);
         setCurrentVariant(prev => ({
           ...prev,
           attributs: {
             ...prev.attributs,
             [normalizeAttributeName(trimmedName)]: ''
           }
         }));
         setNewAttributeName('');
       }
    }
  };

  const handleRemoveAttribute = (attributeToRemove) => {
    if (attributeToRemove === 'Color') return;

    setProductAttributes(prev => prev.filter(attr => attr !== attributeToRemove));
    const normalizedKey = normalizeAttributeName(attributeToRemove);

    setCurrentVariant(prev => {
      const newAttrs = { ...prev.attributs };
      delete newAttrs[normalizedKey];
      return { ...prev, attributs: newAttrs };
    });
    setVariants(prevVariants => prevVariants.map(v => {
      const newAttrs = { ...v.attributs };
      delete newAttrs[normalizedKey];
      return { ...v, attributs: newAttrs };
    }));
  };

  const handleCurrentVariantChange = (e) => {
    const { name, value } = e.target;
    if (name.startsWith('attr-')) {
      const attrKey = name.split('-')[1];
      setCurrentVariant(prev => ({
        ...prev,
        attributs: { ...prev.attributs, [attrKey]: value }
      }));
    } else {
      setCurrentVariant(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleAddVariant = () => {
    const newVariantWithId = { ...currentVariant, tempId: Date.now() + Math.random() };
    setVariants(prev => [...prev, newVariantWithId]);

    const resetAttrs = productAttributes.reduce((acc, attr) => {
      const key = normalizeAttributeName(attr);
       if (key === 'colorhex') {
         acc[key] = '#ffffff';
       } else if (key === 'colornom') {
         acc[key] = '';
       }
       else {
         acc[key] = '';
       }
      return acc;
    }, { colorNom: '', colorHex: '#ffffff' });

    setCurrentVariant({
      sku: '',
      prix: '',
      prixCoutant: '',
      stockQuantity: '',
      lowStockThreshold: '',
      attributs: resetAttrs,
    });
  };

  const handleRemoveVariant = (tempIdToRemove) => {
    setVariants(prev => prev.filter(v => v.tempId !== tempIdToRemove));
  };

  return (
    <div className="flex flex-col ">
      <PagesHeader
        className={'px-4'}
        title="Créer Un Produit"
        breadcrumbs={[
          { label: 'Tableau de bord', link: '/dashboard' },
          { label: 'Produits', link: '/dashboard/products' },
          { label: 'Créer' },
        ]}
      />

      <nav className="mb-8 scrollbar-thumb-transparent scrollbar-track-transparent mx-4 pt-2 text-sm sticky top-0 bg-white z-10 border-b border-gray-300 flex gap-4 md:gap-8 overflow-x-auto">
        {navItems.map((item) => (
          <div key={item.id} className='flex flex-col items-center flex-shrink-0'>
            <HashLink
              smooth
              to={`#${item.id}`}
              className={`px-3 py-2 rounded-md transition-colors duration-200 font-semibold whitespace-nowrap ${activeSection === item.id
                ? 'text-fblack'
                : 'text-gray-500 hover:text-fblack'
                }`}
            >
              {item.label}
            </HashLink>
            <div className={`h-[2px] w-full mt-1 transition-colors duration-200 ${activeSection === item.id
              ? 'bg-fblack'
              : 'bg-transparent'
              }`} />
          </div>
        ))}
      </nav>

      <form onSubmit={handleSubmit(onSubmit)} className='flex flex-col '>

        {/* SECTION 1: Résumé */}
        <section id="sec1" ref={sectionOneRef} className='flex flex-col lg:flex-row px-4 gap-4 lg:gap-8 '>
          <div className='w-full lg:w-[30%] lg:shrink-0 flex flex-col mb-4 lg:mb-0'>
            <p className='font-medium text-fblack text-[16px]'>Résumé</p>
            <p className='text-sm font mt-1 text-gray-500'>Modifiez le titre, le SKU et la description de votre produit ici.</p>
          </div>
          <div className='w-full flex flex-col gap-6'>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Titre</label>
                <input
                  type="text" id="name" {...register("name")}
                  className={`w-full px-3 rounded-[3px] py-2 border ${errors.name ? 'border-red-500' : 'border-gray-300'} focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
                  placeholder="Titre du produit"
                />
                {errors.name && <p className="mt-1 text-xs text-red-600">{errors.name.message}</p>}
              </div>
              <div>
                <label htmlFor="sku" className="block text-sm font-medium text-gray-700 mb-1">SKU (Base)</label>
                <input
                  type="text" id="sku" {...register("sku")}
                  className={`w-full px-3 rounded-[3px] py-2 border ${errors.sku ? 'border-red-500' : 'border-gray-300'} focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
                  placeholder="SKU du produit de base"
                />
                {errors.sku && <p className="mt-1 text-xs text-red-600">{errors.sku.message}</p>}
              </div>
            </div>
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">Description</label>
              <Controller
                name="description" control={control}
                render={({ field }) => (
                  <JoditEditor
                    value={field.value || ''}
                    config={config}
                    onBlur={newContent => field.onChange(newContent)}
                  />
                )}
              />
              {errors.description && <p className="mt-1 text-xs text-red-600">{errors.description.message}</p>}
            </div>
          </div>
        </section>

        <div className='px-4 my-12'> <div style={{ height: 0, width: '100%', borderTop: '1px dashed #cccccc', margin: '0', padding: '0 4rem' }} /> </div>

        {/* SECTION 2: Images */}
        <section id="sec2" ref={sectionTwoRef} className='flex flex-col lg:flex-row px-4 gap-4 lg:gap-8 '>
          <div className='w-full lg:w-[30%] lg:shrink-0 flex flex-col mb-4 lg:mb-0'>
            <p className='font-medium text-fblack text-[16px]'>Images</p>
            <p className='text-sm font mt-1 text-gray-500'>Téléversez ici la galerie d'images de votre produit.</p>
          </div>
          <div className='w-full flex flex-col gap-4'>
            <div
              className='border-gray-300 border-1 cursor-pointer gap-4 w-full rounded-sm py-8 flex flex-col justify-center items-center hover:border-blue-500 transition-colors'
              onClick={handleImageSelectClick} role="button" tabIndex={0} onKeyDown={(e) => e.key === 'Enter' && handleImageSelectClick()}
            >
              <PiCloudArrowUpDuotone className='text-4xl text-gray-600' />
              <p className='text-sm font-semibold text-fblack'>Glissez-déposez ou cliquez pour sélectionner</p>
              <p className='text-xs text-gray-500'>Formats supportés: JPG, PNG, GIF, WEBP</p>
            </div>
            <input type="file" ref={fileInputRef} onChange={handleFileChange} multiple accept="image/*" className="hidden" />
            {imagePreviews.length > 0 && (
              <div className="mt-1 grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-4">
                {imagePreviews.map((preview) => (
                  <div key={preview.url} className="relative group border border-gray-200 rounded overflow-hidden">
                    <img src={preview.url} alt="Aperçu" className="h-24 w-full object-cover" />
                    <button
                      type="button" onClick={() => handleRemoveImage(preview.url, preview.file)}
                      className="absolute top-1 right-1 bg-black bg-opacity-50 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity focus:opacity-100"
                      aria-label="Supprimer l'image"
                    > <PiXBold size={12} /> </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>

        <div className='px-4 my-12'> <div style={{ height: 0, width: '100%', borderTop: '1px dashed #cccccc', margin: '0', padding: '0 4rem' }} /> </div>

        {/* SECTION 3: Catégories */}
        <section id="sec3" ref={sectionThreeRef} className='flex flex-col lg:flex-row px-4 gap-4 lg:gap-8 '>
          <div className='w-full lg:w-[30%] lg:shrink-0 flex flex-col mb-4 lg:mb-0'>
            <p className='font-medium text-fblack text-[16px]'>Catégories</p>
            <p className='text-sm font mt-1 text-gray-500'>Sélectionnez les catégories pour ce produit.</p>
          </div>
          <div className='w-full flex flex-col gap-4'>
            <div className='border border-gray-200 rounded-md overflow-y-auto h-[250px]'>
              {categories.map((category) => {
                const isSelected = selectedCategories.some(c => c.id === category.id);
                return (
                  <div
                    key={category.id} onClick={() => handleCategoryToggle(category)}
                    className={`flex items-center gap-4 p-4 cursor-pointer border-b border-gray-100 last:border-b-0 transition-colors duration-150 ${isSelected ? 'bg-blue-50 hover:bg-blue-100' : 'hover:bg-gray-50'}`}
                  >
                    <PiStackDuotone className='text-gray-400 text-2xl shrink-0' />
                    <div className='flex-grow'>
                      <p className='font-semibold text-sm text-gray-800'>{category.name}</p>
                      <p className='text-xs text-gray-500'>{category.description}</p>
                      <p className='text-xs text-gray-400'>{category.subDescription}</p>
                    </div>
                    <div className='shrink-0 ml-auto'>
                      {isSelected ? (<PiCheckCircleFill className='text-blue-500 text-xl' />) : (<div className='w-5 h-5 border border-gray-300 rounded'></div>)}
                    </div>
                  </div>
                );
              })}
            </div>
            {selectedCategories.length > 0 && (
              <div className='flex flex-wrap items-center gap-2 mt-1'>
                <PiStackDuotone className='text-gray-400 text-lg shrink-0' />
                {selectedCategories.map((category) => (
                  <div key={category.id} className='flex items-center gap-1 bg-gray-100 border border-gray-200 rounded-full px-3 py-1 text-sm text-gray-700'>
                    <span>{category.name}</span>
                    <button type="button" onClick={() => handleRemoveCategoryTag(category)} className='ml-1 text-gray-500 hover:text-red-600' aria-label={`Remove ${category.name}`}> <PiXBold size={12} /> </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>

        <div className='px-4 my-12'> <div style={{ height: 0, width: '100%', borderTop: '1px dashed #cccccc', margin: '0', padding: '0 4rem' }} /> </div>

        {/* SECTION 4: Attributs du Produit */}
        <section id="sec4" ref={sectionFourRef} className='flex flex-col lg:flex-row px-4 gap-4 lg:gap-8 '>
          <div className='w-full lg:w-[30%] lg:shrink-0 flex flex-col mb-4 lg:mb-0'>
            <p className='font-medium text-fblack text-[16px]'>Attributs du Produit</p>
            <p className='text-sm font mt-1 text-gray-500'>Gérez les attributs de vos variantes ici (ex: Taille, Matière). 'Color' est un attribut par défaut.</p>
          </div>
          <div className='w-full flex flex-col gap-4'>
            <div>
              <label htmlFor="attributVariante" className="block text-sm font-medium text-gray-700 mb-1">Attribut de Variante</label>
              <input
                type="text" id="attributVariante" value={newAttributeName} onChange={(e) => setNewAttributeName(e.target.value)} onKeyDown={handleAddAttribute}
                className="w-full px-3 rounded-[3px] py-2 border border-gray-300 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                placeholder="Ajouter un nouvel attribut et appuyez sur Entrée (ex: Taille)"
              />
            </div>
            <div className='flex flex-wrap items-center gap-2 mt-1'>
              {productAttributes.map((attr) => (
                <div key={attr} className='flex items-center gap-1 bg-gray-100 border border-gray-200 rounded-md px-3 py-1 text-sm text-gray-700'>
                  <span>{attr}</span>
                  {attr !== 'Color' && (
                    <button type="button" onClick={() => handleRemoveAttribute(attr)} className='ml-1 text-gray-400 hover:text-red-600' aria-label={`Supprimer ${attr}`}> <PiXBold size={12} /> </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>

        <div className='px-4 my-12'> <div style={{ height: 0, width: '100%', borderTop: '1px dashed #cccccc', margin: '0', padding: '0 4rem' }} /> </div>

        {/* SECTION 5: Variantes de Produit & Stock */}
        <section id="sec5" ref={sectionFiveRef} className='flex flex-col lg:flex-row px-4 gap-4 lg:gap-8 '>
           <div className='w-full lg:w-[30%] lg:shrink-0 flex flex-col mb-4 lg:mb-0'>
            <p className='font-medium text-fblack text-[16px]'>Variantes de Produit & Stock</p>
            <p className='text-sm font mt-1 text-gray-500'>Gérez les détails, le prix et le stock de chaque variante de produit.</p>
          </div>
          <div className='w-full flex flex-col gap-6'>
             <div className="p-4 border border-gray-200 rounded-md">
                <div className='grid grid-cols-1 md:grid-cols-2 gap-4 mb-4'>
                  <div>
                    <label htmlFor="variantSku" className="block text-xs font-medium text-gray-600 mb-1">SKU Variante</label>
                    <input type="text" id="variantSku" name="sku" value={currentVariant.sku} onChange={handleCurrentVariantChange} className="w-full px-3 rounded-[3px] py-2 border border-gray-300 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" placeholder="SKU Variante" />
                  </div>
                   <div></div>
                  <div>
                    <label htmlFor="variantPrix" className="block text-xs font-medium text-gray-600 mb-1">Prix</label>
                    <input type="number" id="variantPrix" name="prix" step="0.01" value={currentVariant.prix} onChange={handleCurrentVariantChange} className="w-full px-3 rounded-[3px] py-2 border border-gray-300 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" placeholder="Prix variante" />
                  </div>
                  <div>
                    <label htmlFor="variantPrixCoutant" className="block text-xs font-medium text-gray-600 mb-1">Prix Coûtant</label>
                    <input type="number" id="variantPrixCoutant" name="prixCoutant" step="0.01" value={currentVariant.prixCoutant} onChange={handleCurrentVariantChange} className="w-full px-3 rounded-[3px] py-2 border border-gray-300 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" placeholder="Coût variante" />
                  </div>
                  <div>
                    <label htmlFor="variantStockQuantity" className="block text-xs font-medium text-gray-600 mb-1">Quantité</label>
                    <input type="number" id="variantStockQuantity" name="stockQuantity" step="1" value={currentVariant.stockQuantity} onChange={handleCurrentVariantChange} className="w-full px-3 rounded-[3px] py-2 border border-gray-300 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" placeholder="Quantité en stock" />
                  </div>
                  <div>
                    <label htmlFor="variantLowStockThreshold" className="block text-xs font-medium text-gray-600 mb-1">Seuil Stock Bas</label>
                    <input type="number" id="variantLowStockThreshold" name="lowStockThreshold" step="1" value={currentVariant.lowStockThreshold} onChange={handleCurrentVariantChange} className="w-full px-3 rounded-[3px] py-2 border border-gray-300 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" placeholder="Alerte stock bas" />
                  </div>
                </div>
                <div className='grid grid-cols-1 md:grid-cols-2 gap-4 mb-4'>
                  {productAttributes.map(attr => {
                    const normalizedKey = normalizeAttributeName(attr);
                    if (attr === 'Color') {
                      return (
                        <React.Fragment key="color-fields">
                          <div>
                              <label htmlFor="attr-colornom" className="block text-xs font-medium text-gray-600 mb-1">Nom de Couleur</label>
                              <input type="text" id="attr-colornom" name="attr-colornom" value={currentVariant.attributs.colornom || ''} onChange={handleCurrentVariantChange} className="w-full px-3 rounded-[3px] py-2 border border-gray-300 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" placeholder="ex: Rouge" />
                          </div>
                          <div className="flex items-end gap-2">
                            <div className="flex-grow">
                              <label htmlFor="attr-colorhex" className="block text-xs font-medium text-gray-600 mb-1">Hex Couleur</label>
                              <input type="text" id="attr-colorhex" name="attr-colorhex" value={currentVariant.attributs.colorhex || ''} onChange={handleCurrentVariantChange} className="w-full px-3 rounded-[3px] py-2 border border-gray-300 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" placeholder="#FF0000" />
                            </div>
                             <input type="color" value={currentVariant.attributs.colorhex || '#ffffff'} onChange={(e) => handleCurrentVariantChange({ target: { name: 'attr-colorhex', value: e.target.value } })} className="h-9 w-9 p-0 border border-gray-300 rounded-[3px] cursor-pointer" title="Choisir une couleur" />
                          </div>
                        </React.Fragment>
                      );
                    } else {
                      return (
                        <div key={attr}>
                          <label htmlFor={`attr-${normalizedKey}`} className="block text-xs font-medium text-gray-600 mb-1">{attr}</label>
                          <input type="text" id={`attr-${normalizedKey}`} name={`attr-${normalizedKey}`} value={currentVariant.attributs[normalizedKey] || ''} onChange={handleCurrentVariantChange} className="w-full px-3 rounded-[3px] py-2 border border-gray-300 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" placeholder={`Valeur pour ${attr}`} />
                        </div>
                      );
                    }
                  })}
                </div>
                <div className="flex justify-end">
                  <button type="button" onClick={handleAddVariant} className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                    <PiPlus className="-ml-1 mr-2 h-5 w-5 text-gray-500" /> Ajouter Variante
                  </button>
                </div>
             </div>
             {variants.length > 0 && (
                <div className="mt-2 flow-root">
                    <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
                        <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
                            <table className="min-w-full divide-y divide-gray-300">
                                <thead>
                                    <tr className="bg-gray-50">
                                        <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-xs font-semibold text-gray-900 sm:pl-3">SKU</th>
                                        {productAttributes.map(attr => (<th key={attr} scope="col" className="px-3 py-3.5 text-left text-xs font-semibold text-gray-900">{attr === 'Color' ? 'Couleur' : attr}</th> ))}
                                        <th scope="col" className="px-3 py-3.5 text-left text-xs font-semibold text-gray-900">Quantité</th>
                                        <th scope="col" className="px-3 py-3.5 text-left text-xs font-semibold text-gray-900">Prix</th>
                                        <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-3"><span className="sr-only">Supprimer</span></th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {variants.map((variant) => (
                                        <tr key={variant.tempId}>
                                            <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-3">{variant.sku}</td>
                                            {productAttributes.map(attr => {
                                              const normalizedKey = normalizeAttributeName(attr);
                                              const isColor = attr === 'Color';
                                              const cellValue = isColor ? variant.attributs.colornom : variant.attributs[normalizedKey];
                                              const colorHex = variant.attributs.colorhex;
                                              return (
                                                <td key={`${variant.tempId}-${attr}`} className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                                                    {isColor ? ( <span className="flex items-center gap-2"> <span className="inline-block h-3 w-3 rounded-full border border-gray-300" style={{ backgroundColor: colorHex || '#ffffff' }}></span> {cellValue || '-'} </span> ) : ( cellValue || '-' )}
                                                </td> );
                                            })}
                                            <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{variant.stockQuantity}</td>
                                            <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">$ {variant.prix}</td>
                                            <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-3">
                                                <button type="button" onClick={() => handleRemoveVariant(variant.tempId)} className="text-gray-400 hover:text-red-600" aria-label="Supprimer variante"> <PiTrash /> </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            )}
          </div>
        </section>

        {/* SECTION 6: SEO */}
        <div className='px-4 my-12'> <div style={{ height: 0, width: '100%', borderTop: '1px dashed #cccccc', margin: '0', padding: '0 4rem' }} /> </div>
        <section id="sec6" ref={sectionSixRef} className='min-h-[200px] flex flex-col lg:flex-row px-4 gap-4 lg:gap-8 '>
            <div className='w-full lg:w-[30%] lg:shrink-0 flex flex-col mb-4 lg:mb-0'>
                <p className='font-medium text-fblack text-[16px]'>SEO</p>
                <p className='text-sm font mt-1 text-gray-500'>Gérez les paramètres SEO pour ce produit.</p>
            </div>
            <div className='w-full'>Section 6 SEO (Contenu à venir)</div>
        </section>

        {/* SECTION 7: Autre */}
        <div className='px-4 my-12'> <div style={{ height: 0, width: '100%', borderTop: '1px dashed #cccccc', margin: '0', padding: '0 4rem' }} /> </div>
        <section id="sec7" ref={sectionSevenRef} className='min-h-[200px] flex flex-col lg:flex-row px-4 gap-4 lg:gap-8 '>
            <div className='w-full lg:w-[30%] lg:shrink-0 flex flex-col mb-4 lg:mb-0'>
                <p className='font-medium text-fblack text-[16px]'>Autre</p>
                <p className='text-sm font mt-1 text-gray-500'>Autres paramètres ou informations.</p>
            </div>
            <div className='w-full'>Section 7 Autre (Contenu à venir)</div>
        </section>

        <div className="flex bg-white mt-8 sticky bottom-0 py-4 border-gray-300 border-t z-10">
          <button type="submit" className="px-6 text-sm cursor-pointer ml-auto mr-4 py-3 bg-primary text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
            Créer Produit
          </button>
        </div>
      </form>
    </div>
  );
}