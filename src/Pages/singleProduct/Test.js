/* eslint-disable no-unused-vars */
/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import ArrowBackOutlinedIcon from "@mui/icons-material/ArrowBackOutlined";
import { Box, Card, InputBase, Modal, TextField, alpha } from "@mui/material";
import { FaMinus, FaPlus } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { addItem, removeItem, updateQuantity, editItem, updateMultipleQuantities } from "../../app/features/Cart/CartSlice";
import SearchIcon from '@mui/icons-material/Search';
import ArrowRightIcon from '@mui/icons-material/ArrowRight';
import sectionnameWiseData from "../Test";
import CloseIcon from '@mui/icons-material/Close';
import "./singleProduct.css";
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import styled from "styled-components";
const SingleProduct = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { sectionName: selectedSectionName } = location.state ?? {};
  const cartItems = useSelector((state) => state.cart.items);
  const [open, setOpen] = useState(false);
  const [dataFetched, setDataFetched] = useState(false);
  const [quantities, setQuantities] = useState({});
  const [openCart, setOpenCart] = useState(false);
  const [itmsQuantity, setItmsQuantity] = useState(0);
  const [cartTotal, setCartTotal] = useState(0);
  const [variantsListPopUp, setVariantsListPopUp] = useState(false);
  const [selectedVariants, setSelectedVariants] = useState([]);
  const [updateItemData, setUpdateItemData] = useState([])
  const [meaalType, setMealType] = useState('Regular')
  const [selectedVariantIndex, setSelectedVariantIndex] = useState(0);
  const [selectedItem, setSelectedItem] = useState(null);
  const [prevData, setPrevData] = useState(null);
  const [newData, setNewData] = useState(null)
  const [iseSearchOpen, setIsSearchOpen] = useState(false)
  const [isEdit, setIsEdit] = useState(false)
  const [selectedItemName, setSelectedItemName] = useState(null);
  const [updateItemDetails, setUpdateItemDetails] = useState(null)
  const [updatedItemQuantity, setUpdatedItemQuantity] = useState(1)
  const [selectedVariantPrice, setSelectedVariantPrice] = useState(0);
  const [updateItemQuantity, setUpdateItemQuantity] = useState(false)
  const [searchQuery, setSearchQuery] = useState("");
  const modalRef = useRef(null);
  const [calculationType, setCalculationType] = useState(null)
  const [selectedSectionsName, setSelectedSectionsName] = useState(selectedSectionName)

  const [repeatLast, setRepeatLast] = useState({
    status: false,
    itemDetails: '',
    variantsList: [],
    allData: null
  })
  const [selectedSection, setSelectedSection] = useState(selectedSectionName);
  const sectionRefs = useRef({});
  const dispatch = useDispatch();
  const handleAdd = (item, itemIndex) => {
    if (item?.variantsList?.length === 1 && item.variantsList[0].unit === "regular") {
      handleAddQuantities(item, itemIndex, item.variantsList[0]);
      setSelectedItem(item)
      setSelectedVariants(null)
      setSelectedVariantIndex(null)
      setSelectedVariantPrice(item?.variantsList[0]?.price)
      setIsEdit(false)
      setVariantsListPopUp(true);
      if (variantsListPopUp && modalRef.current) {
        modalRef.current.classList.add('slide-up-animation');
      }
    } else if (item?.variantsList?.length > 0) {
      setSelectedItem(item)
      setIsEdit(false)
      setSelectedVariantIndex(0)
      setVariantsListPopUp(true);
      setSelectedVariantPrice(item?.variantsList[0]?.price)
      setSelectedVariants(item.variantsList);
      setSelectedItem(item);
      if (variantsListPopUp && modalRef.current) {
        modalRef.current.classList.add('slide-up-animation');
      }
    } else {
      setIsEdit(false)
      handleAddQuantities(item, itemIndex);
      setSelectedVariantIndex(0)
      if (variantsListPopUp && modalRef.current) {
        modalRef.current.classList.add('slide-up-animation');
      }
    }
  };
  const sectionNames = [
    "Hotdog",
    "Burger",
    "Pizza",
    "Toast sandwich",
    "Garlic Bread",
    "French Fries",
  ];

  useEffect(() => {
    if (!dataFetched) {
      const data = localStorage.getItem("cartItems");
      if (data) {
        const parsedData = JSON.parse(data);
        const updatedQuantities = {};

        let totalItems = 0;
        let totalPrice = 0;

        parsedData.forEach(({ itemName, quantity, itemDetails, variantDetails, mealType }) => {
          const { unit, price: variantPrice } = variantDetails || { unit: 'regular', price: itemDetails.itemPrice };
          const key = `${itemName}-${unit}-${mealType}`;
          updatedQuantities[key] = quantity;
          totalItems += quantity;
          totalPrice += quantity * parseInt(variantPrice, 10);
        });

        setQuantities(updatedQuantities);
        setItmsQuantity(totalItems);
        setCartTotal(totalPrice);
        setOpenCart(totalItems > 0);
      }
      setDataFetched(true);
    }
  }, [dataFetched]);
  const handleVariantSelection = (index) => {
    setSelectedVariantIndex(index);
    const price = selectedVariants[index]?.price;
    setSelectedVariantPrice(price)
  };
  const handleOpen = () => setOpen(!open);
  const handleAddQuantities = (itemIndex, index, variantDetails = null) => {
    if (itemIndex?.variantsList.length > 0 && itemIndex?.variantsList[0].unit !== 'regular') {
      const storedItems = JSON.parse(localStorage.getItem('cartItems') || '[]');
      const lastAddedItemIndex = storedItems?.findIndex(item =>
        JSON.stringify(item.itemDetails) === JSON.stringify(itemIndex)
      );
      const variant = storedItems[lastAddedItemIndex]?.variantDetails;
      const filteredItems = storedItems?.filter(val => val.itemName === itemIndex.itemName);
      setSelectedItem(itemIndex);
      setRepeatLast({
        ...repeatLast,
        status: true,
        itemDetails: itemIndex,
        variantsList: variant,
        allData: filteredItems,
        subtract: false
      });
    } else if (itemIndex?.variantsList[0].unit === 'regular') {
      const itemName = itemIndex?.itemName;
      const variantUnit = itemIndex.variantsList[0]?.unit;

      const storedItems = JSON.parse(localStorage.getItem('cartItems') || '[]');
      const lastAddedItemIndex = storedItems?.findIndex(item =>
        JSON.stringify(item.itemDetails) === JSON.stringify(itemIndex)
      );

      if (storedItems[lastAddedItemIndex]) {
        // const key = `${itemName}-${variantUnit}-${storedItems[lastAddedItemIndex]?.mealType}`;
        // const updatedQuantities = {
        //   ...quantities,
        //   [key]: (quantities[key] || 0) + 1,
        // };
        // setQuantities(updatedQuantities);
        // dispatch(updateQuantity({ itemName, quantity: updatedQuantities[key], variantDetails: itemIndex?.variantsList[0], mealType: storedItems[lastAddedItemIndex]?.mealType }));
        const variant = storedItems[lastAddedItemIndex]?.variantDetails;
        const filteredItems = storedItems?.filter(val => val.itemName === itemIndex.itemName);
        setRepeatLast({
          ...repeatLast,
          status: true,
          itemDetails: itemIndex,
          variantsList: variant,
          allData: filteredItems,
          subtract: false
        });
        setSelectedVariantIndex(null)
        // setVariantsListPopUp(true)
      }
    }
    setMealType('Regular');
  };
  const managedCart = (itemName, quantity, itemDetails, variantDetails = null, mealPreparation) => {
    dispatch(
      addItem({
        itemName,
        quantity,
        itemDetails,
        variantDetails,
        mealType: mealPreparation
      })
    );
    updateQuantityofCart();
  };
  const handleClose = () => {
    setRepeatLast(false);
    updateQuantityofCart();
  }
  const handleSubtract = (item, index) => {
    const updatedQuantities = { ...quantities };
    const data = localStorage.getItem("cartItems");

    if (item?.variantsList.length > 0 && item?.variantsList[0].unit !== 'regular') {
      const storedItems = JSON.parse(localStorage.getItem('cartItems'));
      const sameItemIndex = storedItems.findIndex(cartItem =>
        JSON.stringify(cartItem.itemDetails) === JSON.stringify(item)
      );
      const sameItemsCount = storedItems.filter(val => val.itemName === item.itemName).length;
      const variant = storedItems[sameItemIndex]?.variantDetails;
      if (sameItemsCount > 1) {
        setSelectedItem(item);
        updateCartAndLocalStorage(updatedQuantities);
        const filteredItems = storedItems.filter(val => val.itemName === item.itemName);
        setSelectedItem(item);
        setRepeatLast({
          ...repeatLast,
          status: true,
          itemDetails: item,
          variantsList: variant,
          allData: filteredItems,
          subtract: true
        });
        if (sameItemsCount < 1) {
          setRepeatLast(false)
        }
      } else {
        const itemName = item.itemName;
        const variantUnit = variant.unit;
        const storedItems = JSON.parse(localStorage.getItem('cartItems') || '[]');
        const lastAddedItemIndex = storedItems.findIndex(cartItem =>
          JSON.stringify(cartItem.itemDetails) === JSON.stringify(item)
        );
        if (storedItems[lastAddedItemIndex]) {
          const key = `${itemName}-${variantUnit}-${storedItems[lastAddedItemIndex]?.mealType}`;
          updatedQuantities[key] = (updatedQuantities[key] || 0) - 1;
          setQuantities(updatedQuantities);
          dispatch(updateQuantity({ itemName: itemName, quantity: updatedQuantities[key], variantDetails: variant, mealType: storedItems[lastAddedItemIndex]?.mealType }));
        }
        updateCartAndLocalStorage(updatedQuantities);
      }
    } else if (item?.variantsList[0].unit === 'regular') {
      const itemName = item.itemName;
      const variantUnit = item.variantsList[0].unit;
      const storedItems = JSON.parse(localStorage.getItem('cartItems') || '[]');
      const lastAddedItemIndex = storedItems.findIndex(cartItem =>
        JSON.stringify(cartItem.itemDetails) === JSON.stringify(item)
      );
      if (storedItems[lastAddedItemIndex]) {
        const key = `${itemName}-${variantUnit}-${storedItems[lastAddedItemIndex]?.mealType}`;
        updatedQuantities[key] = (updatedQuantities[key] || 0) - 1;
        setQuantities(updatedQuantities);
        dispatch(updateQuantity({ itemName, quantity: updatedQuantities[key], variantDetails: item?.variantsList[0], mealType: storedItems[lastAddedItemIndex]?.mealType }));
      }
      updateCartAndLocalStorage(updatedQuantities);
    }
    if (itmsQuantity === 0) {
      setOpenCart(false);
    }
  };

  useEffect(() => {
    if (selectedSection) {
      sectionRefs.current[selectedSection]?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  }, [selectedSection]);
  const updateCartAndLocalStorage = (updatedQuantities) => {
    const data = localStorage.getItem("cartItems");
    if (data) {
      const parsedData = JSON.parse(data);
      let totalItems = 0;
      let totalPrice = 0;

      parsedData.forEach(({ itemName, quantity, itemDetails, variantDetails }) => {
        const price = variantDetails ? variantDetails.price : itemDetails.itemPrice;
        if (updatedQuantities[itemName]) {
          updatedQuantities[itemName] += quantity;
        } else {
          updatedQuantities[itemName] = quantity;
        }
        totalItems += quantity;
        totalPrice += quantity * parseInt(price, 10);
      });

      setQuantities(updatedQuantities);
      setItmsQuantity(totalItems);
      setCartTotal(totalPrice);
      setOpenCart(totalItems > 0);
      setSelectedVariantIndex(0)
      // if (repeatLast?.allData?.length === 1) {
      //   setVariantsListPopUp(false)
      //   setRepeatLast(false)
      // }
    }
  };
  const handleAddVariantToCart = () => {
    if (selectedVariantIndex !== null) {
      const selectedVariant = selectedVariants[selectedVariantIndex];
      const itemName = selectedItem?.itemName;
      if (itemName !== undefined) {
        const key = `${itemName}-${selectedVariant?.unit}-${meaalType}`;
        const updatedQuantities = {
          ...quantities,
          [key]: (quantities[key] || 0) + 1,
        };
        setVariantsListPopUp(false);
        updateCartAndLocalStorage(updatedQuantities)
        const filteredItems = JSON.parse(localStorage.getItem('cartItems'))?.filter(val => val.itemName === itemName);
        updateCartAndLocalStorage(updatedQuantities)
        setRepeatLast({
          status: false,
          itemDetails: selectedItem,
          variantsList: selectedVariant,
          quantity: updatedQuantities[key],
          allData: filteredItems,
          subtract: false
        });
        if (!isEdit) {
          managedCart(itemName, updatedQuantities[key], selectedItem, selectedVariant, meaalType);
        } else {
          const variant = selectedVariant
          const quantiti = quantities[key]
          setNewData({
            itemName: itemName,
            variantDetails: variant,
            mealType: meaalType,
            quantity: quantiti
          })
          const newItem = {
            itemName: itemName,
            variantDetails: variant,
            mealType: meaalType,
            quantity: quantiti
          }
          dispatch(editItem({ prevItem: prevData, newItem: newItem }))
          updateQuantityofCart();
          setIsEdit(false)
        }
        setSelectedVariantIndex(null)
        setMealType('Regular')
      }
    } else {
      const itemName = selectedItem?.itemName;
      const variantUnit = selectedItem?.variantsList[0]?.unit
      const key = `${itemName}-${variantUnit}-${meaalType}`;
      const updatedQuantities = {
        ...quantities,
        [key]: (quantities[key] || 0) + 1,
      };
      setQuantities(updatedQuantities);
      managedCart(itemName, updatedQuantities[key], selectedItem, selectedItem.variantsList[0], meaalType);
      setVariantsListPopUp(false)
      updateCartAndLocalStorage(updatedQuantities)
      setSelectedVariantIndex(null)
    }
  };
  const handleRepeatLast = () => {
    const { itemDetails } = repeatLast;
    const itemName = itemDetails?.itemName;
    if (!itemName) {
      console.log("Item name is undefined.");
      return;
    }

    const storedItems = JSON.parse(localStorage.getItem('cartItems'));
    const lastAddedItemIndex = storedItems.findIndex(item =>
      JSON.stringify(item.itemDetails) === JSON.stringify(itemDetails)
    );

    if (lastAddedItemIndex !== -1) {
      const updatedItems = [...storedItems];
      updatedItems[lastAddedItemIndex].quantity += 1;
      const variantDetails = storedItems[lastAddedItemIndex].variantDetails;
      const variantUnit = variantDetails ? variantDetails.unit : 'regular';
      const key = `${itemName}-${variantUnit}-${storedItems[lastAddedItemIndex]?.mealType}`;
      const updatedQuantities = {
        ...quantities,
        [key]: (quantities[key] || 0) + 1,
      };
      const meal = storedItems[lastAddedItemIndex]?.mealType
      dispatch(updateQuantity({
        itemName,
        quantity: updatedItems[lastAddedItemIndex].quantity,
        variantDetails: variantDetails,
        mealType: meal
      }));
      setRepeatLast(false);
      updateCartAndLocalStorage(updatedQuantities)
    } else {
      console.log("No matching item found in the cart.");
    }
  };
  const handleSingleVariantAddPrice = (item, quantity) => {
    setUpdateItemQuantity(true)
    setCalculationType('plus')
    const key = `${item.itemName}-${item.variantDetails.unit}-${item.mealType}`;
    const updatedQuantity = {
      ...quantities,
      [key]: (quantities[key] || 0) + 1,
    };
    setUpdatedItemQuantity(quantity)
    setUpdateItemDetails(item)
    setUpdateItemData([
      ...updateItemData,
      {
        itemName: item.itemName,
        quantity: updatedQuantity[key],
        variantDetails: item.variantDetails,
        mealType: item?.mealType
      }
    ]);

    setQuantities(updatedQuantity)
  };
  const handleConfirmUpdateItem = (item, quantity) => {
    setUpdateItemQuantity(false);
    const key = `${item.itemName}-${item.variantDetails.unit}-${item.mealType}`;
    const updatedQuantity = { ...quantities };
    const quantiti = quantity;

    if (calculationType === 'plus') {
      updatedQuantity[key] = quantiti;
    } else {
      updatedQuantity[key] = quantiti;
    }

    const updatedArray = updateItemData.map((dataItem) => {
      if (
        dataItem.itemName === item.itemName &&
        dataItem.variantDetails.unit === item.variantDetails.unit &&
        dataItem.mealType === item.mealType
      ) {
        return {
          ...dataItem,
          quantity: updatedQuantity[key]
        };
      }
      return dataItem;
    });

    dispatch(updateMultipleQuantities(updatedArray));
    setRepeatLast((prevState) => {
      const updatedItems = prevState.allData.map((dataItem) =>
        dataItem.itemName === item.itemName &&
          dataItem.variantDetails.unit === item.variantDetails.unit &&
          dataItem.mealType === item.mealType
          ? { ...dataItem, quantity: updatedQuantity[key] }
          : dataItem
      );
      return { ...prevState, allData: updatedItems };
    });

    updateCartAndLocalStorage(updatedQuantity);
    const storedItems = JSON.parse(localStorage.getItem('cartItems') || '[]');
    const lastAddedItemIndex = storedItems?.findIndex(item =>
      JSON.stringify(item.itemDetails) === JSON.stringify(item)
    );
    const sameItemsCount = storedItems.filter(val => val.itemName === item.itemName).length;
    const variant = storedItems[lastAddedItemIndex]?.variantDetails;
    console.log('variant', lastAddedItemIndex)
    const filteredItems = storedItems?.filter(val => val.itemName === item.itemName);
    setSelectedItem(item);
    setVariantsListPopUp(false)
    if (sameItemsCount < 1) {
      setRepeatLast(false)
    }
  };
  const handleSingleVariantSubtractPrice = (item, quantity) => {
    setUpdateItemQuantity(true)
    setCalculationType('minus')
    const key = `${item.itemName}-${item.variantDetails.unit}-${item.mealType}`;
    const updatedQuantity = {
      ...quantities,
      [key]: (quantities[key] || 0) - 1,
    };
    setUpdateItemData([
      ...updateItemData,
      {
        itemName: item.itemName,
        quantity: updatedQuantity[key],
        variantDetails: item.variantDetails,
        mealType: item?.mealType
      }
    ]);
    if (updatedQuantity[key] >= 0) {
      setUpdatedItemQuantity(updatedQuantity[key]);
      setUpdateItemDetails(item);
      setQuantities(updatedQuantity);
    }
  };
  const handleEditItem = (item) => {
    setIsEdit(true)
    const { itemName } = item.itemDetails;
    const meal = item.mealType
    setPrevData({
      itemName: item.itemName,
      variantDetails: item.variantDetails,
      mealType: item.mealType,
      quantity: item.quantity
    })
    setSelectedItemName(item.itemDetails)
    setMealType(meal)
    const unit = item.variantDetails.unit;
    for (let i = 0; i < sectionnameWiseData.length; i++) {
      const section = sectionnameWiseData[i];
      const itemsData = section.itemsData;
      const selectedItemData = itemsData.find((data) => data.itemName === itemName);
      if (selectedItemData) {
        const variantsList = selectedItemData.variantsList || [];
        setSelectedVariants(variantsList)
        const unitIndex = variantsList.findIndex(val => val.unit === unit)
        setSelectedVariantIndex(unitIndex)
        break;
      }
    }
    const price = item?.variantDetails?.price
    setSelectedVariantPrice(price)
    setVariantsListPopUp(true)
    updateQuantityofCart()
  };
  const updateQuantityofCart = () => {
    const data = localStorage.getItem("cartItems");
    if (data) {
      const parsedData = JSON.parse(data);
      const updatedQuantities = {};
      let totalItems = 0;
      let totalPrice = 0;
      parsedData.forEach(({ itemName, quantity, itemDetails, variantDetails, mealType }) => {
        const { unit, price: variantPrice } = variantDetails || { unit: 'regular', price: itemDetails.itemPrice };
        const key = `${itemName}-${unit}-${mealType}`;
        updatedQuantities[key] = quantity;
        totalItems += quantity;
        totalPrice += quantity * parseInt(variantPrice, 10);
      });
      setQuantities(updatedQuantities);
      setItmsQuantity(totalItems);
      setCartTotal(totalPrice);
      setOpenCart(totalItems > 0);
    }
  }
  const CustomTextField = styled(TextField)({
    '& .MuiInputBase-root': {
      backgroundColor: 'white',
      borderRadius: '8px',
      border: '2px solid #000',
      '& input': {
        padding: '5px 10px 5px 10px',
        fontSize: '16px',
        width: '100%',
      },
      '& .MuiInputAdornment-root': {
        color: '#000',
      },
      '& :focus': {
        outline: "none",
        borderColor: '#000',
      }
    },
  });
  const details = updateItemDetails;
  const quantity = updatedItemQuantity;
  return (
    <div>
      <div className="back_icon cursor-pointer fixed items-center top-0 flex justify-between bg-white w-full p-2 z-20">
        <div className="arrowIcon">
          <ArrowBackOutlinedIcon onClick={() => navigate("/")} />
        </div>
        {iseSearchOpen ? (
          <div className="searchBar">
            <input
              type="search"
              name=""
              placeholder="Search items..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                padding: '8px 36px 8px 10px',
                fontSize: '16px',
                width: '100%',
                borderRadius: '8px',
                border: '2px solid #000',
                backgroundColor: 'white',
                outline: 'none',
              }}
            />
          </div>
        ) : (
          <div className="p-2" onClick={() => setIsSearchOpen(true)}>
            <SearchIcon />
          </div>
        )
        }
      </div>
      <div className="mt-12">
        {sectionNames.map((sectionName, index) => {
          const sectionData = sectionnameWiseData.find(
            (data) => data.sectionName === sectionName
          );
          const filteredItems = sectionData?.itemsData.filter((item) =>
            item.itemName.toLowerCase().includes(searchQuery.toLowerCase())
          );
          return (
            <div key={index} className="">
              <section className="font-semibold text-lg px-2 bg-white py-2 sticky top-11  shadow-sm z-10" ref={(ref) => (sectionRefs.current[sectionName] = ref)} id={sectionName}>
                {sectionName}
              </section>
              <hr className="mb-2" />
              <div>
                {filteredItems &&
                  filteredItems.map((item, itemIndex) => {
                    const itemName = item.itemName;
                    const quantityInCart = cartItems.reduce((acc, cartItem) => {
                      if (cartItem.itemName === itemName) {
                        return acc + cartItem.quantity;
                      }
                      return acc;
                    }, 0);

                    return (
                      <div key={itemIndex} className="my-4 px-2 shadow">
                        <div className="grid grid-cols-12 items-center bg-white  p-4">
                          <div className="col-span-7">
                            <div className="font-semibold">{itemName}</div>
                            <p className="tracking-widest font-semibold">
                              &#x20B9;{item.itemPrice}
                            </p>
                            <p className="text-gray-600 text-sm mt-1">
                              {item?.itemDescription}
                            </p>
                          </div>
                          <div className="col-span-5 px-2">
                            <div className="itemQuantity">
                              {quantityInCart > 0 ? (
                                <div className="flex items-center border overflow-hidden rounded-lg shadow-md">
                                  <p
                                    className="minus w-2/6 text-center text-sm text-red-600 px-2 text-align-webkit"
                                    onClick={() => handleSubtract(item, itemIndex)}
                                  >
                                    <FaMinus />
                                  </p>
                                  <div className="quantity w-2/6 text-center h-8 text-black font-bold text-md bg-red-300 px-1">
                                    <p className="mt-1">{quantityInCart}</p>
                                  </div>
                                  <p
                                    className="plus w-2/6  text-center text-sm px-2  text-red-600 text-align-webkit"
                                    onClick={() => handleAddQuantities(item, itemIndex)}
                                  >
                                    <FaPlus />
                                  </p>
                                </div>
                              ) : (
                                <div className="flex items-center overflow-hidden rounded-lg shadow-md">
                                  <div
                                    className="minus w-full text-center text-md p-1 px-3 font-bold"
                                    onClick={() => { handleAdd(item, itemIndex); setSelectedItemName(item) }}
                                  >
                                    ADD{" "}
                                    <span className="text-red-600 text-xl ml-1">&#43;</span>
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
              </div>
            </div>
          );
        })}
      </div>
      <div
        className={`fixed ${openCart ? "bottom-24" : "bottom-2"} right-1 z-30 `}
      >
        {open && (
          <div className="bg-white p-2 shadow-md rounded-md w-72">
            {sectionNames &&
              sectionNames.map((section, index) => (
                <Card
                  key={index}
                  variant="outlined"
                  className={`p-4 my-1 hover:cursor-pointer ${selectedSectionsName === section ? "activeSection" : ""
                    }`}
                  onClick={() => {
                    setSelectedSectionsName(section);
                    setOpen(false);
                  }}
                >
                  <a href={`#${section}`} onClick={() => setOpen(false)}>
                    <div>{section}</div>
                  </a>
                </Card>
              ))}
          </div>
        )}
        <div
          className={`p-2 bg-blue-600 text-center w-32 rounded-lg shadow-lg text-white cursor-pointer ${open ? "marginLeft" : ""}`}
          onClick={handleOpen}
        >
          MENU
        </div>
      </div>
      {openCart && (
        <div className="fixed bottom-2 left-1/2 transform -translate-x-1/2 w-full z-30">
          <div
            className="p-2 customBg text-center mx-2 rounded-md text-white cursor-pointer"
            onClick={() => navigate("/Cart")}
          >
            <div className="flex justify-between items-center px-2">
              <div>
                <p className="text-md tracking-widest">{itmsQuantity} items</p>
                <p className="text-xl font-medium text-start tracking-wider">
                  &#x20B9;{cartTotal}
                </p>
              </div>
              <div className="text-xl tracking-wider">View Cart ⮞</div>
            </div>
          </div>
        </div>
      )}
      {variantsListPopUp && (
        <Modal
        open={variantsListPopUp}
        onClose={() => setVariantsListPopUp(!variantsListPopUp)}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
        sx={{ '&:focus': { outline: 'none' } }}
        className='border-none css-zi5cg-MuiModal-root:focus'
        disableAutoFocus
        ref={modalRef}
      >
        <Box
          className="fixed bottom-0 bg-gray-200 shadow-lg rounded-t-lg h-fit border left-1/2 transform -translate-x-1/2 w-full"
        >
          <div
            className="rounded-full cursor-pointer p-2 w-12 h-12 absolute -top-14 left-1/2 transform -translate-x-1/2 z-50 bg-slate-600 flex items-center justify-center"
            onClick={() => {
              setVariantsListPopUp(false)
            }}
          >
            <CloseIcon className='text-white' />
          </div>
          <div className="itemname p-2 my-2 font-semibold bg-white text-2xl mx-2 shadow-md rounded-md">
            {selectedItemName?.itemName}
            <p className="text-sm text-gray-400">{selectedItemName?.itemDescription}</p>
          </div>
          <div className="shadow-md overflow-hidden mx-2 bg-white rounded-md">
            {selectedVariants?.length > 0 ? (
              <div className='text-2xl p-2 border-b font-semibold'>Quantity</div>
            ) : (<></>)}
            {selectedVariants?.map((variant, index) => (
              <div
                key={index}
                className="custom-radio-container p-2 py-3 text-lg border-b"
                onClick={() => handleVariantSelection(index)}
              >
                <div>
                  <span className="ml-2">{variant.unit}</span>
                </div>
                <label className="custom-radio-label">
                  <span className='pl-2'>&#x20B9;{variant.price}</span>
                  <input
                    type="radio"
                    name="variant"
                    checked={selectedVariantIndex === index}
                    onChange={() => handleVariantSelection(index)}
                    onClick={() => handleVariantSelection(index)}
                  />
                  <span className="custom-radio-mark"></span>
                </label>
              </div>
            ))}
          </div>
          <div className="my-2">
            <div className="flex justify-between rounded-md mx-2 shadow-md bg-white py-2">
              <div className="flex flex-col justify-between text-lg w-full">
                <div className='text-2xl p-2 border-b font-semibold'>Preparation</div>
                <label className="custom-radio-label px-3 py-3 justify-between border-b">
                  Regular
                  <input
                    type="radio"
                    name="preference"
                    className="mr-2"
                    checked={meaalType === 'Regular'}
                    onChange={() => setMealType('Regular')}
                  />
                  <span className="custom-radio-mark"></span>
                </label>
                <label className="custom-radio-label justify-between w-full px-3 py-3">
                  Jain
                  <input
                    type="radio"
                    name="preference"
                    className="mr-2"
                    checked={meaalType === 'Jain'}
                    onChange={() => setMealType('Jain')}
                  />
                  <span className="custom-radio-mark"></span>
                </label>
              </div>
            </div>
          </div>
          <div className="py-3 px-1 mx-2 rounded-md shadow-md bg-white flex justify-between gap-6 text-center">
            <div className="w-full text-start px-1 font-semibold">
              <p>Total Price</p>
              <p>
                ₹{selectedVariantPrice}{" "}
              </p>
            </div>
            <button
              className="bg-red-600 w-full text-white py-2 px-4 rounded mr-2"
              onClick={handleAddVariantToCart}
            >
              {isEdit ? 'Edit' : 'Add'}
            </button>
          </div>
        </Box>
      </Modal>
      )}
      {repeatLast.status && (
        <Modal
          open={repeatLast.status}
          onClose={() => { handleClose(); updateQuantityofCart(); }}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
          className='border-none'
          disableAutoFocus
        >
          <Box onClose={() => { handleClose(); updateQuantityofCart(); }} className="fixed  bottom-0 h-fit py-3 bg-white shadow-lg rounded-t-lg  border left-1/2 transform -translate-x-1/2 w-full">
            <div
              className="rounded-full cursor-pointer  p-2 w-12 h-12 absolute -top-14 left-1/2 transform -translate-x-1/2 z-50 bg-slate-600 flex items-center justify-center"
              onClick={() => {
                handleClose(false)
              }}
            >
              <CloseIcon className='text-white' />
            </div>
            <div className="p-4 ">
              <div className="text-red-600 my-1">{!repeatLast?.subtract ? 'Repeat Last used Customization' : 'Remove Items '}</div>
              <hr className="my-1 border-black"></hr>
              <div className="fixedHeight">
                {repeatLast?.allData && repeatLast.allData.map((item, index) => {
                  const key = `${item?.itemDetails?.itemName}-${item?.variantDetails?.unit}-${item.mealType}`;
                  const itemQuantity = quantities[key];
                  return (
                    <div key={index} className="flex justify-between items-center p-2 border-b">
                      <div className="text-start">
                        <span className="ml-2">{item?.itemDetails?.itemName}&nbsp;({item?.variantDetails?.unit})</span> <br />
                        <span className="ml-2 text-md text-gray-400">Preperation: {item?.mealType}</span> <br />
                        <span className="ml-2">&#x20B9;{item?.variantDetails?.price}</span>
                        <div
                          className="text-gray-700 text-xs flex items-center cursor-pointer"
                          onClick={() => {
                            handleEditItem(item);
                          }}
                        >
                          Customize <ArrowDropDownIcon />
                        </div>
                      </div>
                      <div className="flex items-center h-fit border overflow-hidden rounded-lg shadow-md">
                        <p
                          className="minus w-full text-center text-sm text-red-600 px-3"
                          onClick={() => handleSingleVariantSubtractPrice(item, itemQuantity - 1)}
                        >
                          <FaMinus />
                        </p>
                        <div className="quantity w-full text-center h-8 text-black font-bold text-md bg-red-300 px-3">
                          <p className="mt-1">{itemQuantity}</p>
                        </div>
                        <p
                          className="plus w-full text-center text-sm px-3 text-red-600"
                          onClick={() => handleSingleVariantAddPrice(item, itemQuantity + 1)}
                        >
                          <FaPlus />
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
            <div className="flex w-full  text-center">
              <div className="flex  w-full px-2 text-center">
                {!repeatLast.subtract && !updateItemQuantity && (
                  <div className='flex justify-between gap-4 w-full'>
                    <button
                      className="bg-red-600 w-full text-white py-2 px-4 rounded mr-2"
                      onClick={() => {
                        handleAddQuantities(repeatLast.itemDetails, repeatLast.itemDetails.itemIndex, repeatLast.itemDetails.variantsList[selectedVariantIndex]);
                        setRepeatLast({ ...repeatLast, status: false });
                        setSelectedVariants(repeatLast.itemDetails.variantsList);
                        setSelectedVariantIndex(0);
                        setVariantsListPopUp(true);
                      }}
                    >
                      Add Other
                    </button>
                    <button
                      className="bg-gray-600 w-full text-white py-2 px-4 rounded"
                      onClick={handleRepeatLast}
                    >
                      Repeat Last
                    </button>
                  </div>
                )}
                {repeatLast.subtract && !updateItemQuantity && (
                  <button
                    className="customBg w-full text-white py-2 px-4 rounded mr-2"
                    onClick={() => {
                      setRepeatLast(false);
                    }}
                  >
                    Confirm
                  </button>
                )}
                {updateItemQuantity ? (
                  <div className='flex justify-between gap-4 w-full'>
                    <button
                      className="bg-red-600 w-full text-white py-2 px-4 rounded mr-2"
                      onClick={() => handleConfirmUpdateItem(details, quantity)}
                    >
                      Confirm
                    </button>
                    <button
                      className="bg-gray-600 w-full text-white py-2 px-4 rounded"
                      onClick={() => {
                        setUpdateItemQuantity(false);

                        updateQuantityofCart()
                      }}
                    >
                      Cancel
                    </button>
                  </div>
                ) : (
                  <></>
                )}
              </div>
            </div>
          </Box>
        </Modal>
      )
      }
    </div>
  );
};
export default SingleProduct;