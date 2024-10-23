import React, {useEffect, useState} from 'react';

import {FaBars, FaCalendar, FaEllipsisV, FaPlus, FaWrench} from "react-icons/fa";
import TextView from "../components/TextViewComponent/TextView";
import ClientSidebar from "../components/Sidebars/ClientSidebarComponent/ClientSidebar";
import eventsPlot from "../testData/eventsPlot.json";
import styles from "./styles/ClientStyle.module.css";
import Button from "../components/ButtonComponent/Button";
import InputText from "../components/InputTextComponent/InputText";
import AddTeamMemberModalComponent from "../components/AddTeamModalComponent/AddTeamMemberModal";
import Avatar from "../components/AvatarComponent/Avatar";
import Popover from "../components/PopoverModalComponent/Popover";
import AddTeamMemberModal from "../components/AddTeamModalComponent/AddTeamMemberModal";
import AddProductModal, {Product} from "../components/AddProductModalComponent/AddProductModal";
import AddCategoryModal, {Category} from "../components/AddCategoryModalComponent/AddCategoryModal";
import ProductCategoryListingModal
    from "../components/ProductCategoryListingModalComponent/ProductCategoryListingModal";
import EditProductModal from "../components/EditProductModalComponent/EditProductModal";
interface SidebarItem {
    label: string;
    href?: string;
    type: 'link' | 'div';
    id?: string;
    active?: boolean;
}
const InventoryPage: React.FC = () => {
    const [reservations, setReservations] = useState<any[]>([]);
    const [activeItemId, setActiveItemId] = useState<string | null>('clientDetail');
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
    const [isCategoryModalOpen, setIsCategoryModalOpen] = useState<boolean>(false);
    const [isManageCategoryModalOpen, setIsManageCategoryModalOpen] = useState<boolean>(false);
    const [showEditModal, setShowEditModal] = useState<boolean>(false);

    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [categoryData, setCategoryData] = useState<Category[]>( []);
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
    const [teamSearch, setTeamSearch] = useState<any>(null);
    const [products, setProducts] = useState<Product[]>([]);
    const sidebarItems: SidebarItem[] = [
        { label: 'Dashboard', href: '/', type: 'link' },
        { label: 'Client List', href: '/clientlist', type: 'link' },
        { label: 'Service/Package', href: '/catalog', type: 'link'},
        { label: 'Product Page', href: '/product', type: 'link', active: true  },
        { label: 'Sales', href: '/sales', type: 'link' },
        { label: 'Team', href: '/team', type: 'link'  },
        { label: 'Marketing Kit', href: '/marketing', type: 'link'  },
    ];
    const handleItemClick = (id: string, type: 'link' | 'div') => {
        setActiveItemId(id);
    };
    useEffect(() => {
        console.log(products)
    }, [products]);



    const handleAddProduct = (newProduct: Product) => {
        setProducts((prevProducts) => [...prevProducts, newProduct]);
    };

    const handleSaveCategory = (updatedCategory: Category) => {
        setCategoryData((prevCategories) =>
            prevCategories.map((cat) =>
                cat.id === updatedCategory.id ? updatedCategory : cat
            )
        );
    };
    const handleAddCategory = (category: Category) => {
        setCategoryData([...categoryData, category]);
    };
    const handleProductUpdate = (updatedProduct: Product) => {
        setProducts((prevProducts) =>
            prevProducts.map((product) =>
                product.id === updatedProduct.id ? updatedProduct : product
            )
        );
    };
    const openEditModal = (product: Product) => {
        setSelectedProduct(product);
        setShowEditModal(true);
    };
    return (
        <div className={`flex flex-col lg:flex-row h-screen`}>
            {isModalOpen && (
                <AddProductModal
                    onClose={() => setIsModalOpen(false)}
                    onAddProduct={handleAddProduct}
                    categories={categoryData}
                />
            )}
            {isCategoryModalOpen && <AddCategoryModal hasColorPicker={false} onClose={() => setIsCategoryModalOpen(false)}
                                                      onAddCategory={handleAddCategory}/>}
            {isManageCategoryModalOpen && (
                <ProductCategoryListingModal
                    categories={categoryData}
                    onUpdateCategory={handleSaveCategory}
                    onClose={() => setIsManageCategoryModalOpen(false)}
                />
            )}

            {showEditModal &&  selectedProduct && (
                <EditProductModal
                    product={selectedProduct}
                    onClose={() => setShowEditModal(false)}
                    onSaveProduct={handleProductUpdate}
                    categories={categoryData}
                />
            )}
            <div className="lg:hidden p-4 flex justify-between items-center">
                <button className="text-2xl" onClick={() => setIsSidebarOpen(!isSidebarOpen)}>
                    <FaBars/>
                </button>
                <span className="text-xl">Product</span>
            </div>
            <div
                className={`lg:flex-none lg:p-4 border-r border-r-gray-300 lg:w-1/8 lg:block ${isSidebarOpen ? 'block' : 'hidden lg:block'}`}>
                <div
                    className={`${isSidebarOpen ? styles.pageLabel + ' hidden' : styles.pageLabel + ' hidden lg:block'}`}>
                    <TextView text="Menu"/>
                </div>
                <ClientSidebar items={sidebarItems} onItemClick={handleItemClick}/>
            </div>

            <div className="flex-1 p-4">
                <div id="clientHeading" className="flex items-center justify-between">
                    <div className={`w-1/2`}>
                        <div className="flex items-center">
                            <div className={`${styles.pageContentHeading} mr-3`}>
                                <TextView text="Inventory Management"/>
                            </div>

                        </div>
                        <div>
                            <div className={styles.pageSubText}>
                                <TextView text="View and manage your product in stock here"/>
                            </div>
                        </div>
                    </div>
                    <div className="flex w-full items-center justify-end">
                        <div className={`mr-2`}><Button onClick={() => (setIsModalOpen(true))} disabled={categoryData.length === 0}><FaPlus className="mr-2"/>Add New Product</Button></div>
                        <div className={`mr-2`}><Button onClick={() => (setIsManageCategoryModalOpen(true))} disabled={categoryData.length === 0}><FaWrench className="mr-2"/>Manage Categories</Button></div>
                        <div className={`mr-2`}><Button onClick={() => (setIsCategoryModalOpen(true))}><FaPlus className="mr-2"/>Add New Product Category</Button></div>
                    </div>
                </div>
                <div className={`w-full mt-2p flex items-center justify-between ${styles.clientListSearchSection}`}>
                    <div className="w-1/2">
                        <InputText placeholder="Search by name, description or barcode" value={teamSearch ?? ''}
                                   onChange={(e) => setTeamSearch(e.target.value)} name="clientSearch"/>
                    </div>
                </div>
                <div className="mt-2p">
                    <div className="mt-2p flex items-center justify-start border-b border-b-gray-300">
                        <div className="p-2 w-1/4 text-center ${styles.clientListingContentHeading}">
                            <TextView text="Product Name" />
                        </div>
                        <div className="p-2  w-1/4 text-center ${styles.clientListingContentHeading}">
                            <TextView text="Category " />
                        </div>
                        <div className="p-2 w-1/4 text-center ${styles.clientListingContentHeading}">
                            <TextView text="Supplier" />
                        </div>
                        <div className="p-2 w-1/4 text-center ${styles.clientListingContentHeading}">
                            <TextView text="Quantity" />
                        </div>
                        <div className="p-2 w-1/4 text-center ${styles.clientListingContentHeading}">
                            <TextView text="Actions" />
                        </div>
                    </div>
                    <div id="clientListContent">
                        <div className={`flex flex-col m-2p justify-start`}>
                            {products.length > 0 ? (
                                products.map((product, index) => (
                                    <div key={product.id || index} className={`flex w-full m-2p justify-start`}>
                                        <div className="p-2 w-1/4 flex-shrink-0 flex justify-start">
                                            {product.thumbnail ? (
                                                <img
                                                    src={`/temp/productImg/bottleSample.jpg`}
                                                    alt={product.name}
                                                    className="w-[75px] h-[75px] rounded-full object-cover"
                                                />
                                            ) : (
                                                <Avatar name={product.name} size="75px" />
                                            )}
                                            <div className="ml-10p mt-2p">
                                                <TextView className="text-center text-lg font-bold" text={product.name} />
                                            </div>
                                        </div>
                                        <div className="p-2 w-1/4 text-center">
                                            <TextView text={ categoryData.find((cat) => cat.id === Number(product.category))?.name || 'N/A'} />
                                        </div>
                                        <div className="p-2 w-1/4 text-center">
                                            <TextView text={product.supplier || 'N/A'} />
                                        </div>
                                        <div className="p-2 w-1/4 text-center">
                                            <TextView text={product.stockQuantity.toString()} />
                                        </div>
                                        <div className="p-2 w-1/4 text-center">
                                            <Popover
                                                position={`left`}
                                                trigger={<FaEllipsisV />}
                                                content={
                                                    <div>
                                                        <div onClick={() => openEditModal(product) } style={{ padding: '8px', cursor: 'pointer' }}>
                                                            Edit
                                                        </div>
                                                        <div onClick={() => console.log('Delete product')} style={{ padding: '8px', cursor: 'pointer' }}>
                                                            Delete
                                                        </div>
                                                    </div>
                                                }
                                            />
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="w-full text-center mt-10p">
                                    <TextView text="No products available." />
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

        </div>

    );
};

export default InventoryPage;