import React, {useEffect, useState} from 'react';
import { useSelector,useDispatch } from 'react-redux';
import {RootState, AppDispatch} from "../redux/store";
import {addOrUpdateProduct} from "../redux/slices/productSlice";
import {addCategory, updateCategory} from "../redux/slices/productCategorySlice";
import {FaBars, FaEllipsisV, FaPlus, FaWrench} from "react-icons/fa";
import TextView from "../components/TextViewComponent/TextView";
import ClientSidebar from "../components/Sidebars/ClientSidebarComponent/ClientSidebar";
import styles from "./styles/ClientStyle.module.css";
import Button from "../components/ButtonComponent/Button";
import InputText from "../components/InputTextComponent/InputText";
import Avatar from "../components/AvatarComponent/Avatar";
import Popover from "../components/PopoverModalComponent/Popover";
import AddProductModal from "../components/AddProductModalComponent/AddProductModal";
import AddCategoryModal from "../components/AddCategoryModalComponent/AddCategoryModal";
import ProductCategoryListingModal from "../components/ProductCategoryListingModalComponent/ProductCategoryListingModal";
import EditProductModal from "../components/EditProductModalComponent/EditProductModal";
import UsageProductModal from "../components/UsageProductModalComponent/UsageProductModal";
import {sidebarItems} from "./menuitems/sidebarItems";
import {useNavigate} from "react-router-dom";
import {Product} from "../types/Product";
import {Category} from "../types/Category";
import usageProductModal from "../components/UsageProductModalComponent/UsageProductModal";


const InventoryPage: React.FC = () => {
    const navigate = useNavigate();
    //Modal configs
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
    const [isCategoryModalOpen, setIsCategoryModalOpen] = useState<boolean>(false);
    const [isManageCategoryModalOpen, setIsManageCategoryModalOpen] = useState<boolean>(false);
    const [showEditModal, setShowEditModal] = useState<boolean>(false);
    const [showUsageModal, setShowUsageModal] = useState<boolean>(false);
    //Modal END

    //Connected to Redux Store
    const products = useSelector((state: RootState) => state.products.valueProduct || []);
    const categoryData = useSelector((state: RootState) => state.productCategories.categories || []);
    const serviceData = useSelector((state: RootState) => state.services.valueService || []);
    const dispatch = useDispatch<AppDispatch>();
    //Redux Store END

    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
    const [teamSearch, setTeamSearch] = useState<any>(null);

    const [activeItem, setActiveItem] = useState<string | null>('product');
    const [selectedProductId, setSelectedProductId] = useState<number>(0);
    const handleItemClick = (id: string, type: 'link' | 'div') => {
        setActiveItem(id);
        if (type === 'link') {
            navigate(id);
        }
    };

    const handleSaveCategory = (updatedCategory: Category) => {
        dispatch(updateCategory(updatedCategory))
    };
    const handleAddCategory = (category: Category) => {
        dispatch(addCategory(category))
    };
    const handleProductUpdate = (updatedProduct: Product) => {
        dispatch(addOrUpdateProduct(updatedProduct));
    };
    const openEditModal = (product: Product) => {
        setSelectedProduct(product);
        setShowEditModal(true);
    };
    const openUsageModal = (product: Product) => {
        setShowUsageModal(true);
        setSelectedProductId(Number(product.id));
    };

    return (
        <div className={`flex flex-col lg:flex-row h-screen`}>
            {isModalOpen && (
                <AddProductModal
                    onClose={() => setIsModalOpen(false)}
                    categories={categoryData}
                />
            )}
            {isCategoryModalOpen && <AddCategoryModal hasColorPicker={false} onClose={() => setIsCategoryModalOpen(false)}
                                                      onAddCategory={handleAddCategory} categoryTagging={'product'} />}
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

            { showUsageModal &&   (
                <UsageProductModal
                    productId={selectedProductId}
                    onClose={() => setShowUsageModal(false)}
                />
            )}
            <div className={`lg:hidden p-4 flex justify-between items-center`}>
                <button className="text-2xl" onClick={() => setIsSidebarOpen(!isSidebarOpen)}>
                    <FaBars/>
                </button>
                <span className="text-xl">Inventory Management</span>
            </div>
            <div
                className={`lg:flex-none lg:p-4 border-r border-r-gray-300 lg:w-1/8 lg:block ${isSidebarOpen ? 'block' : 'hidden lg:block'}`}>
                <div
                    className={`${isSidebarOpen ? styles.pageLabel + ' hidden' : styles.pageLabel + ' hidden lg:block'}`}>
                    <TextView text="Menu"/>
                </div>
                <ClientSidebar items={sidebarItems} onItemClick={handleItemClick} activeItem={activeItem}/>
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
                        <div className={`mr-2`}><Button onClick={() => (setIsModalOpen(true))} disabled={categoryData.length === 0}><FaPlus className="mr-2"/>Add Product</Button></div>
                        <div className={`mr-2`}><Button onClick={() => (setIsManageCategoryModalOpen(true))} disabled={categoryData.length === 0}><FaWrench className="mr-2"/>Edit Categories</Button></div>
                        <div className={`mr-2`}><Button onClick={() => (setIsCategoryModalOpen(true))}><FaPlus className="mr-2"/>Add Category</Button></div>
                    </div>
                 </div>
                <div className={`w-full mt-2p flex items-center justify-between ${styles.clientListSearchSection}`}>
                    <div className={`w-1/2`}>
                        <InputText placeholder="Search by name, description or barcode" value={teamSearch ?? ''}
                                   onChange={(e) => setTeamSearch(e.target.value)} name="clientSearch"/>
                    </div>
                </div>
                <div className={`mt-2p`}>
                    <div className={`mt-2p flex items-center justify-start border-b border-b-gray-300`}>
                        <div className={`p-2 w-[515px] text-center`}>
                            <TextView text="Product Name"/>
                        </div>
                        <div className={`p-2  w-1/4 text-center`}>
                            <TextView text="Product Category"/>
                        </div>
                        <div className={`p-2 w-1/4 text-center`}>
                            <TextView text="Supplier"/>
                        </div>
                        <div className={`p-2 w-1/4 text-center`}>
                            <TextView text="Quantity"/>
                        </div>
                        <div className={`p-2 w-1/4 text-center`}>
                            <TextView text="Used Quantity"/>
                        </div>
                        <div className={`p-2 w-1/4 text-center`}>
                            <TextView text="Remaining Quantity"/>
                        </div>
                        <div className={`p-2 w-1/4 text-center`}>

                        </div>
                    </div>
                    <div id="clientListContent">
                        <div className={`mt-2p flex flex-col items-center justify-start border-b border-b-gray-300`}>
                            {Object.keys(products).length > 0 ? (
                                Object.values(products).flat().map((product, index) => (
                                    <div key={product.id || index} className={`flex w-full m-2p justify-start`}>
                                        <div className="p-2 w-[515px] flex justify-start">
                                            {product.thumbnail ? (
                                                <img
                                                    src={product.thumbnail} // Use the actual thumbnail from the product
                                                    alt={product.name}
                                                    className="w-[75px] h-[75px] rounded-full object-cover"
                                                />
                                            ) : (
                                                <Avatar name={product.name} size="75px"/>
                                            )}
                                            <div className="ml-10p mt-2p">
                                                <TextView className="text-center text-lg font-bold"
                                                          text={product.name}/>
                                            </div>
                                        </div>
                                        <div className="p-2 w-1/4 text-center">
                                            <TextView text={
                                                categoryData.find(category => category.id === Number(product.category))?.name || 'N/A'
                                            }/>
                                        </div>
                                        <div className="p-2 w-1/4 text-center">
                                            <TextView text={product.supplier || 'N/A'}/>
                                        </div>
                                        <div className="p-2 w-1/4 text-center">
                                            <TextView text={product.stockQuantity.toString()}/>
                                        </div>
                                        <div className="p-2 w-1/4 text-center">
                                            <TextView text={product.stockQuantityUsed?.toString() || '0'}/>
                                        </div>
                                        <div className="p-2 w-1/4 text-center">
                                            <TextView text={product.stockQuantityRemaining?.toString() || product.stockQuantity.toString()}/>
                                        </div>
                                        <div className="p-2 w-1/4 text-center">
                                            <Popover
                                                position={`left`}
                                                trigger={<FaEllipsisV/>}
                                                content={
                                                    <div>
                                                        <div onClick={() => openEditModal(product)}
                                                             style={{padding: '8px', cursor: 'pointer'}}>
                                                            Edit
                                                        </div>
                                                        <div onClick={() => console.log( product.id)}
                                                             style={{padding: '8px', cursor: 'pointer'}}>
                                                            Delete
                                                        </div>
                                                        <div onClick={() => openUsageModal(product)}
                                                             style={{padding: '8px', cursor: 'pointer'}}>
                                                            Historical Usage
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
