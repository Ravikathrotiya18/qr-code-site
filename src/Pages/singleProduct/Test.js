import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import ArrowBackOutlinedIcon from "@mui/icons-material/ArrowBackOutlined";
import { Box, Card, Modal } from "@mui/material";
import { FaMinus, FaPlus } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { addItem, removeItem, updateQuantity } from "../../app/features/Cart/CartSlice";
import sectionnameWiseData from "../Test";
import "./singleProduct.css";

const SingleProduct = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { sectionName: selectedSectionName } = location.state;
  const cartItems = useSelector((state) => state.cart.items);

  const [open, setOpen] = useState(false);
  const [dataFetched, setDataFetched] = useState(false);
  const [quantities, setQuantities] = useState({});
  const [openCart, setOpenCart] = useState(false);
  const [itmsQuantity, setItmsQuantity] = useState(0);
  const [cartTotal, setCartTotal] = useState(0);
  const [multipleItemsPopUp, setMultipleItemsPopUp] = useState(false)
  const [variantsListPopUp, setVariantsListPopUp] = useState(false);
  const [selectedVariants, setSelectedVariants] = useState([]);
  const [selectedVariantIndex, setSelectedVariantIndex] = useState(null);
  const [selectedItem, setSelectedItem] = useState(null);
  const [repeatLast, setRepeatLast] = useState({
    status: false,
    itemDetails: '',
    variantsList: []
  })

  const dispatch = useDispatch();

  const handleAdd = (item, itemIndex) => {
    if (item?.variantsList?.length === 1 && item.variantsList[0].unit === "regular") {
      setOpenCart(true);
      handleAddQuantities(item, itemIndex, item.variantsList[0]);
      setSelectedItem(item)
    } else if (item?.variantsList?.length > 0) {
      setVariantsListPopUp(true);
      setSelectedVariants(item.variantsList);
      setSelectedItem(item);
    } else {
      setOpenCart(true);
      handleAddQuantities(item, itemIndex);
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

        parsedData.forEach(({ itemName, quantity, itemDetails, variantDetails }) => {
          const { unit, price: variantPrice } = variantDetails || { unit: 'regular', price: itemDetails.itemPrice };
          const key = `${itemName}-${unit}`;
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
  };

  const handleOpen = () => setOpen(!open);
  const handleAddQuantities = (itemIndex, index, variantDetails = null) => {
    if (itemIndex?.variantsList.length > 0 && itemIndex?.variantsList[0].unit !== 'regular') {
      const storedItems = JSON.parse(localStorage.getItem('cartItems') || '[]');
      const lastAddedItemIndex = storedItems.findIndex(item =>
        JSON.stringify(item.itemDetails) === JSON.stringify(itemIndex)
      );

      const variant = storedItems[lastAddedItemIndex]?.variantDetails;
      const key = `${itemIndex?.itemName}-${variant?.unit}`;

      const updatedQuantities = {
        ...quantities,
        [key]: (quantities[key] || 0) + 1,
      };
      setQuantities(updatedQuantities);
      const filteredItems = storedItems.filter(val => val.itemName === itemIndex.itemName);
      setSelectedItem(itemIndex);
      setRepeatLast({
        ...repeatLast,
        status: true,
        itemDetails: itemIndex,
        variantsList: variant,
        quantity: updatedQuantities[key],
        allData: filteredItems,
        subtract: false
      });

    } else if (itemIndex?.variantsList[0].unit === 'regular') {
      const itemName = itemIndex.itemName;
      const variantUnit = itemIndex.variantsList[0].unit;
      const key = `${itemName}-${variantUnit}`;

      const updatedQuantities = {
        ...quantities,
        [key]: (quantities[key] || 0) + 1,
      };

      setQuantities(updatedQuantities);
      managedCart(itemName, updatedQuantities[key], itemIndex, itemIndex.variantsList[0]);
    }
  };

  const managedCart = (itemName, quantity, itemDetails, variantDetails = null) => {
    dispatch(
      addItem({
        itemName,
        quantity,
        itemDetails,
        variantDetails,
      })
    );

    const data = localStorage.getItem("cartItems");
    if (data) {
      const parsedData = JSON.parse(data);
      const updatedQuantities = {};
      let totalItems = 0;
      let totalPrice = 0;

      parsedData.forEach(({ itemName, quantity, itemDetails, variantDetails }) => {
        const price = variantDetails ? variantDetails.price : itemDetails.itemPrice;
        const variantUnit = variantDetails ? variantDetails.unit : "regular";
        const key = `${itemName}-${variantUnit}`;
        updatedQuantities[key] = quantity;
        totalItems += quantity;
        totalPrice += quantity * parseInt(price, 10);
      });
      setQuantities(updatedQuantities);
      setItmsQuantity(totalItems);
      setCartTotal(totalPrice);
      setOpenCart(totalItems > 0);
    }
  };
  const handleClose = () => {
    setRepeatLast({ status: false });

  }

  const handleSubtract = (item, index) => {
    const itemName = item.itemName;
    const updatedQuantities = { ...quantities };
    if (item?.variantsList.length > 0 && item?.variantsList[0].unit !== 'regular') {
      const storedItems = JSON.parse(localStorage.getItem('cartItems'));
      const lastAddedItemIndex = storedItems.findIndex(cartItem =>
        JSON.stringify(cartItem.itemDetails) === JSON.stringify(item)
      );
      const variant = storedItems[lastAddedItemIndex]?.variantDetails;
      const key = `${item?.itemName}-${variant?.unit}`;
      updatedQuantities[key] = (updatedQuantities[key] || 0) - 1;
      setSelectedItem(item);
      updateCartAndLocalStorage(updatedQuantities)
      const filteredItems = storedItems.filter(val => val.itemName === item.itemName);
      setSelectedItem(item);
      setRepeatLast({
        ...repeatLast,
        status: true,
        itemDetails: item,
        variantsList: variant,
        quantity: updatedQuantities[key],
        allData: filteredItems,
        subtract: true
      });
    } else if (item?.variantsList[0].unit === 'regular') {
      const variantUnit = item.variantsList[0].unit;
      const key = `${itemName}-${variantUnit}`;
      updatedQuantities[key] = (updatedQuantities[key] || 0) - 1;
      dispatch(updateQuantity({ itemName, quantity: updatedQuantities[key], variantDetails: item?.variantsList[0] }));
      updateCartAndLocalStorage(updatedQuantities);
    }

    setQuantities(updatedQuantities);

    if (itmsQuantity === 0) {
      setOpenCart(false);
    }
  };

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
    }
  };
  const handleAddVariantToCart = () => {
    if (selectedVariantIndex !== null) {
      const selectedVariant = selectedVariants[selectedVariantIndex];
      const itemName = selectedItem?.itemName;
      if (itemName !== undefined) {
        const key = `${itemName}-${selectedVariant?.unit}`;
        const updatedQuantities = {
          ...quantities,
          [key]: (quantities[key] || 0) + 1,
        };
        setQuantities(updatedQuantities);
        setItmsQuantity((prev) => prev + 1);
        setCartTotal((prev) => prev + parseInt(selectedVariant.price, 10));
        managedCart(itemName, updatedQuantities[key], selectedItem, selectedVariant);
        setVariantsListPopUp(false);
        setOpenCart(true);
        updateCartAndLocalStorage(updatedQuantities)
        const filteredItems = JSON.parse(localStorage.getItem('cartItems')).filter(val => val.itemName === itemName);
        setRepeatLast({
          status: false,
          itemDetails: selectedItem,
          variantsList: selectedVariant,
          quantity: updatedQuantities[key],
          allData: filteredItems,
          subtract: false
        });
      }
    }
  };

  const handleRepeatLast = () => {
    const { itemDetails, variantsList } = repeatLast;
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
      const key = `${itemName}-${variantUnit}`;
      const updatedQuantities = {
        ...quantities,
        [key]: (quantities[key] || 0) + 1,
      };
      setQuantities(updatedQuantities);
      setCartTotal(prev => prev + parseInt(variantDetails.price, 10));
      setItmsQuantity(prev => prev + 1);
      dispatch(updateQuantity({
        itemName,
        quantity: updatedItems[lastAddedItemIndex].quantity,
        variantDetails: variantDetails,
      }));
      setRepeatLast(false);
      setOpenCart(true);
    } else {
      console.log("No matching item found in the cart.");
    }
  };
  const handleSingleVariantAddPrice = (item) => {
    const updatedQuantity = item.quantity + 1;
    dispatch(updateQuantity({ itemName: item.itemName, quantity: updatedQuantity, variantDetails: item.variantDetails }));
    setRepeatLast((prevState) => {
      const updatedItems = prevState.allData.map((dataItem) =>
        dataItem.itemName === item.itemName && dataItem.variantDetails.unit === item.variantDetails.unit
          ? { ...dataItem, quantity: updatedQuantity }
          : dataItem
      );
      return { ...prevState, allData: updatedItems };
    });

    updateCartAndLocalStorages(updatedQuantity);
  };

  const handleSingleVariantSubtractPrice = (item) => {
    const updatedQuantity = item.quantity - 1;
    if (updatedQuantity > 0) {
      dispatch(updateQuantity({ itemName: item.itemName, quantity: updatedQuantity, variantDetails: item.variantDetails }));
      setRepeatLast((prevState) => {
        const updatedItems = prevState.allData.map((dataItem) =>
          dataItem.itemName === item.itemName && dataItem.variantDetails.unit === item.variantDetails.unit
            ? { ...dataItem, quantity: updatedQuantity }
            : dataItem
        );
        return { ...prevState, allData: updatedItems };
      });

      updateCartAndLocalStorages(updatedQuantity);

    }
    if (updatedQuantity < 1) {
      dispatch(removeItem({ itemName: item.itemName, variantDetails: item.variantDetails }))
      updateCartAndLocalStorages(updatedQuantity)
      const updatedAllData = repeatLast.allData.filter((dataItem) =>
        dataItem.itemName !== item.itemName || dataItem.variantDetails.unit !== item.variantDetails.unit
      );
      setRepeatLast((prevState) => ({
        ...prevState,
        allData: updatedAllData,
      }));
    }
  };

  const updateCartAndLocalStorages = (updatedQuantity) => {
    const data = localStorage.getItem("cartItems");
    if (data) {
      const parsedData = JSON.parse(data);
      let totalItems = 0;
      let totalPrice = 0;

      parsedData.forEach(({ itemName, quantity, itemDetails, variantDetails }) => {
        const price = variantDetails ? variantDetails.price : itemDetails.itemPrice;
        totalItems += quantity;
        totalPrice += quantity * parseInt(price, 10);
      });

      setItmsQuantity(totalItems);
      setCartTotal(totalPrice);
      setOpenCart(totalItems > 0);
    }
  };
  return (
    <div>
      <div className="back_icon cursor-pointer fixed top-0 bg-white w-full p-2 z-20">
        <ArrowBackOutlinedIcon onClick={() => navigate("/")} />
      </div>
      <div className="mt-12">
        {sectionNames.map((sectionName, index) => {
          const sectionData = sectionnameWiseData.find(
            (data) => data.sectionName === sectionName
          );

          return (
            <div key={index} className="">
              <section className="font-semibold text-lg px-2 bg-white py-2 sticky top-8 z-10">
                {sectionName}
              </section>
              <hr className="my-2" />
              <div>
                {sectionData &&
                  sectionData.itemsData.map((item, itemIndex) => {
                    const itemName = item.itemName;
                    const quantityInCart = item.variantsList.reduce((acc, variant) => {
                      const itemInCart = cartItems.find(
                        (cartItem) =>
                          cartItem.itemName === itemName &&
                          cartItem.variantDetails.unit === variant.unit
                      );
                      return acc + (itemInCart ? itemInCart.quantity : 0);
                    }, 0);
                    return (
                      <div key={itemIndex} className="my-4 px-2 shadow">
                        <div className="grid grid-cols-12 items-center bg-white  p-4">
                          <div className="col-span-8">
                            <div className="font-semibold">{itemName}</div>
                            <p className="tracking-widest font-semibold">
                              &#x20B9;{item.itemPrice}
                            </p>
                            <p className="text-gray-600 text-sm mt-1">
                              {item.itemDescription}
                            </p>
                          </div>
                          <div className="col-span-4 px-2">
                            <div className="itemQuantity">
                              {quantityInCart > 0 ? (
                                <div className="flex items-center border overflow-hidden rounded-lg shadow-md">
                                  <p
                                    className="minus w-full text-center text-sm text-red-600 px-2 text-align-webkit"
                                    onClick={() => handleSubtract(item, itemIndex)}
                                  >
                                    <FaMinus />
                                  </p>
                                  <div className="quantity w-full text-center h-8 text-black font-bold text-md bg-red-300 px-2">
                                    <p className="mt-1">{quantityInCart}</p>
                                  </div>
                                  <p
                                    className="plus w-full  text-center text-sm px-2  text-red-600 text-align-webkit"
                                    onClick={() => handleAddQuantities(item, itemIndex)}
                                  >
                                    <FaPlus />
                                  </p>
                                </div>
                              ) : (
                                <div className="flex items-center overflow-hidden rounded-lg shadow-md">
                                  <div
                                    className="minus w-full text-center text-md p-1 px-3 font-bold"
                                    onClick={() => handleAdd(item, itemIndex)}
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
        className={`fixed ${openCart ? "bottom-24" : "bottom-2"} right-1 z-30  shadow-lg `}
      >
        {open && (
          <div className="bg-white p-2 shadow-md rounded-md w-72">
            {sectionNames &&
              sectionNames.map((section, index) => (
                <Card
                  key={index}
                  variant="outlined"
                  onClick={() => {
                    navigate("/singleProduct", {
                      state: { sectionName: section },
                    });
                    setOpen(false);
                  }}
                  className="p-4 my-1 hover:cursor-pointer"
                >
                  <div className="">{section} </div>
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
          className='border-none'
        >
          <Box className="fixed bottom-0 py-3 bg-white shadow-lg rounded-t-lg h-fit border left-1/2 transform -translate-x-1/2 w-full">
            <div className="p-4">
              {selectedVariants.map((variant, index) => (
                <div key={index} className="flex justify-between p-2 border-b" onClick={() => handleVariantSelection(index)}>
                  <div>
                    <span className="ml-2">{variant.unit}</span>
                  </div>
                  <div>
                    <span className="mr-2">&#x20B9;{variant.price}</span>
                    <input
                      type="radio"
                      name="variant"
                      checked={selectedVariantIndex === index}
                      onChange={() => handleVariantSelection(index)}
                    />
                  </div>
                </div>
              ))}
            </div>
            <div className="p-2 flex justify-center gap-4 text-center">
              <button
                className="bg-red-600 w-full text-white py-2 px-4 rounded mr-2"
                onClick={handleAddVariantToCart}
              >
                Add
              </button>
              <button
                className="bg-gray-600 w-full text-white py-2 px-4 rounded"
                onClick={() => setVariantsListPopUp(false)}
              >
                Cancel
              </button>
            </div>
          </Box>
        </Modal>
      )}
      {repeatLast.status && (
        <Modal
          open={repeatLast.status}
          onClose={handleClose}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
          className='border-none'
        >
          <Box onClose={handleClose} className="fixed bottom-0 h-fit py-3 bg-white shadow-lg rounded-t-lg  border left-1/2 transform -translate-x-1/2 w-full">
            <div className="p-4">
              <div className="text-red-600 my-1">{!repeatLast?.subtract ? 'Repeat Last used Customization' : 'Remove Items '}</div>
              <hr className="my-1 border-black"></hr>
              {repeatLast?.allData && repeatLast.allData?.map((item, index) => (

                <div key={index} className="flex justify-between items-center p-2 border-b">
                  <div className="text-start">
                    <span className="ml-2">{item?.itemDetails?.itemName} </span> <br />
                    <span className="ml-2 text-md text-gray-400">Preperation :- {item?.variantDetails?.unit} </span> <br />
                    <span className="ml-2">&#x20B9;{item?.variantDetails?.price}</span>
                  </div>
                  <div className="flex items-center h-fit border overflow-hidden rounded-lg shadow-md">
                    <p
                      className="minus w-full text-center  text-sm text-red-600 px-3"
                      onClick={() => handleSingleVariantSubtractPrice(item)}
                    >
                      <FaMinus />
                    </p>
                    <div className="quantity w-full text-center h-8 text-black font-bold text-md bg-red-300 px-3">
                      <p className="mt-1">{item?.quantity}</p>
                    </div>
                    <p
                      className="plus w-full text-center text-sm px-3 text-red-600"
                      onClick={() => handleSingleVariantAddPrice(item)}
                    >
                      <FaPlus />
                    </p>
                  </div>
                </div>
              ))}
            </div>
            <div className="flex gap-4 justify-center p-2 text-center">
              {!repeatLast.subtract ? (
                <div className='flex gap-4 w-full'>
                  <button
                    className="bg-red-600 w-1/2 text-white py-2 px-4 rounded mr-2"
                    onClick={() => {
                      handleAddQuantities(repeatLast.itemDetails, repeatLast.itemDetails.itemIndex, repeatLast.itemDetails.variantsList[selectedVariantIndex]);
                      setRepeatLast({ ...repeatLast, status: false });
                      setSelectedVariants(repeatLast.itemDetails.variantsList);
                      setSelectedVariantIndex(0);
                      setVariantsListPopUp(true);
                      setRepeatLast({ ...repeatLast, status: false });
                    }}
                  >
                    Add Other
                  </button>
                  <button
                    className="bg-gray-600 w-1/2 text-white py-2 px-4 rounded"
                    onClick={handleRepeatLast}
                  >
                    Repeat Last
                  </button>

                </div>
              ) : (
                <button
                  className="customBg w-full text-white py-2 px-4 rounded mr-2"
                  onClick={() => {
                    setRepeatLast(false);
                  }}
                >
                  Confirm
                </button>
              )}

            </div>
          </Box>
        </Modal>
      )}
    </div>
  );
};
export default SingleProduct;
