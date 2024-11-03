import React, {useEffect, useState} from 'react';
import { useSelector,useDispatch } from 'react-redux';
import {RootState, AppDispatch} from "../redux/store";
import {addOrUpdateProduct} from "../redux/slices/productSlice";
import {FaBars, FaEllipsisV, FaPlus, FaWrench} from "react-icons/fa";
import TextView from "../components/TextViewComponent/TextView";
import ClientSidebar from "../components/Sidebars/ClientSidebarComponent/ClientSidebar";
import styles from "./styles/ClientStyle.module.css";
import Button from "../components/ButtonComponent/Button";
import InputText from "../components/InputTextComponent/InputText";
import Avatar from "../components/AvatarComponent/Avatar";
import Popover from "../components/PopoverModalComponent/Popover";
import AddProductModal from "../components/AddProductModalComponent/AddProductModal";
import AddCategoryModal, {Category} from "../components/AddCategoryModalComponent/AddCategoryModal";
import ProductCategoryListingModal from "../components/ProductCategoryListingModalComponent/ProductCategoryListingModal";
import EditProductModal from "../components/EditProductModalComponent/EditProductModal";
import {sidebarItems} from "./menuitems/sidebarItems";
import {useNavigate} from "react-router-dom";
import {Product} from "../types/Product";

const InventoryPage: React.FC = () => {
    const navigate = useNavigate();
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
    const [isCategoryModalOpen, setIsCategoryModalOpen] = useState<boolean>(false);
    const [isManageCategoryModalOpen, setIsManageCategoryModalOpen] = useState<boolean>(false);
    const [showEditModal, setShowEditModal] = useState<boolean>(false);
    const products = useSelector((state: RootState) => state.products.valueProduct || []);
    const dispatch = useDispatch<AppDispatch>();
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [categoryData, setCategoryData] = useState<Category[]>( []);
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
    const [teamSearch, setTeamSearch] = useState<any>(null);

    const [activeItem, setActiveItem] = useState<string | null>('product');

    const handleItemClick = (id: string, type: 'link' | 'div') => {
        setActiveItem(id);
        if (type === 'link') {
            navigate(id);
        }
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
        dispatch(addOrUpdateProduct(updatedProduct));
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
                        <div className="p-2 w-[515px] text-center ">
                            <TextView text="Product Name"/>
                        </div>
                        <div className="p-2  w-1/4 text-center">
                            <TextView text="Product Category"/>
                        </div>
                        <div className="p-2 w-1/4 text-center">
                            <TextView text="Supplier"/>
                        </div>
                        <div className="p-2 w-1/4 text-center">
                            <TextView text="Quantity"/>
                        </div>
                        <div className="p-2 w-1/4 text-center">
                            <TextView text="Used Quantity"/>
                        </div>
                        <div className="p-2 w-1/4 text-center">
                            <TextView text="Remaining Quantity"/>
                        </div>
                        <div className="p-2 w-1/4 text-center">

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
                                            <TextView text={product.category || 'N/A'}/>
                                        </div>
                                        <div className="p-2 w-1/4 text-center">
                                            <TextView text={product.supplier || 'N/A'}/>
                                        </div>
                                        <div className="p-2 w-1/4 text-center">
                                            <TextView text={product.stockQuantity.toString()}/>
                                        </div>
                                        <div className="p-2 w-1/4 text-center">
                                            <TextView text={product.stockQuantity.toString()}/>
                                        </div>
                                        <div className="p-2 w-1/4 text-center">
                                            <TextView text={product.stockQuantity.toString()}/>
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
                                                        <div onClick={() => console.log('Delete product')}
                                                             style={{padding: '8px', cursor: 'pointer'}}>
                                                            Delete
                                                        </div>
                                                        <div onClick={() => console.log('Historical Usage')}
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
