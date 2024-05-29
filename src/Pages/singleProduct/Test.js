import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import ArrowBackOutlinedIcon from "@mui/icons-material/ArrowBackOutlined";
import { Card } from "@mui/material";
import { FaMinus, FaPlus } from "react-icons/fa";
import { useDispatch } from "react-redux";
import { addItem, updateQuantity } from "../../app/features/Cart/CartSlice";
import sectionnameWiseData from "../Test";
import "./singleProduct.css";

const SingleProduct = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { sectionName: selectedSectionName } = location.state;

  const [open, setOpen] = useState(false);
  const [dataFetched, setDataFetched] = useState(false);
  const [quantities, setQuantities] = useState({});
  const [openCart, setOpenCart] = useState(false);
  const [itmsQuantity, setItmsQuantity] = useState(0);
  const [cartTotal, setCartTotal] = useState(0);
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
    } else if (item?.variantsList?.length > 0) {
      setVariantsListPopUp(true);
      setSelectedVariants(item.variantsList);
      setSelectedItem({ item, itemIndex });
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
  const sectionData = sectionnameWiseData.find(
    (data) => data.sectionName === selectedSectionName
  );
  const otherSections = sectionNames.filter(
    (data) => data !== selectedSectionName
  );
  useEffect(() => {
    if (!dataFetched) {
      const data = localStorage.getItem("cartItems");
      if (data) {
        const parsedData = JSON.parse(data);
        const updatedQuantities = {};
        let totalItems = 0;
        let totalPrice = 0;

        parsedData.forEach(({ itemIndex, quantity, itemDetails, variantDetails }) => {
          const price = variantDetails ? variantDetails.price : itemDetails.itemPrice;
          if (updatedQuantities[itemIndex]) {
            updatedQuantities[itemIndex] += quantity;
          } else {
            updatedQuantities[itemIndex] = quantity;
          }
          totalItems += quantity;
          totalPrice += quantity * parseInt(price, 10);
        });

        setQuantities(updatedQuantities);
        setItmsQuantity(totalItems);
        setCartTotal(totalPrice);
        setOpenCart(totalItems > 0);
      }
      setDataFetched(true);
    }
  }, [dataFetched]);
  const handleOpen = () => setOpen(!open);
  const handleAddQuantities = (itemIndex, index, variantDetails = null) => {
    if (itemIndex?.variantsList.length > 0 && itemIndex?.variantsList[0].unit !== 'regular') {
      const storedItems = JSON.parse(localStorage.getItem('cartItems'));

      const lastAddedItemIndex = storedItems.findIndex(item =>
        JSON.stringify(item.itemDetails) === JSON.stringify(itemIndex)
      );

      const variantsList = storedItems[lastAddedItemIndex].variantDetails;

      setRepeatLast({ ...repeatLast, status: true, itemDetails: itemIndex, variantsList: variantsList })
      setOpenCart(false)
    }
    else {
      const itemName = itemIndex.itemName;
      const updatedQuantities = {
        ...quantities,
        [itemName]: (quantities[itemName] || 0) + 1,
      };
      const price = variantDetails ? variantDetails.price : sectionData.itemsData[index]?.itemPrice;
      setQuantities(updatedQuantities);
      setItmsQuantity((prev) => prev + 1);
      setCartTotal((prev) => prev + parseInt(price, 10));
      managedCart(itemName, updatedQuantities[itemName], itemIndex, variantDetails);
    }
  };
  const managedCart = (itemIndex, quantity, itemDetails, variantDetails = null) => {
    dispatch(
      addItem({
        itemIndex,
        quantity,
        itemDetails,
        variantDetails,
      })
    );
  };
  const handleSubtract = (item, index) => {
    const itemName = item.itemName;
    const updatedQuantities = { ...quantities };
    if (updatedQuantities[itemName] > 0) {
      updatedQuantities[itemName] -= 1;
      dispatch(updateQuantity({ itemIndex: itemName, quantity: updatedQuantities[itemName] }));
      const data = localStorage.getItem("cartItems");
      if (data) {
        const parsedData = JSON.parse(data);
        const updatedQuantities = {};
        let totalItems = 0;
        let totalPrice = 0;
        parsedData.forEach(({ itemIndex, quantity, itemDetails, variantDetails }) => {
          const price = variantDetails ? variantDetails.price : itemDetails.itemPrice;
          updatedQuantities[itemIndex] = quantity;
          totalItems += quantity;
          totalPrice += quantity * parseInt(price, 10);
        });
        setQuantities(updatedQuantities);
        setItmsQuantity(totalItems);
        setCartTotal(totalPrice);
        setOpenCart(totalItems > 0);
      }
    }
    if (itmsQuantity === 0) {
      setOpenCart(false)
    }
  };
  const handleAddVariantToCart = () => {
    if (selectedVariantIndex !== null) {
      const selectedVariant = selectedVariants[selectedVariantIndex];
      const itemName = selectedItem?.item?.itemName;
      const updatedQuantities = {
        ...quantities,
        [itemName]: 1,
      };
      setQuantities(updatedQuantities);
      setItmsQuantity((prev) => prev + 1);
      setCartTotal((prev) => prev + parseInt(selectedVariant.price, 10));
      managedCart(itemName, updatedQuantities[itemName], selectedItem?.item, selectedVariant);
      setVariantsListPopUp(false);
      setOpenCart(true)
    }
  };
  const handleRepeatLast = () => {
    const { itemDetails } = repeatLast;
    const itemName = itemDetails.itemName;
    const storedItems = JSON.parse(localStorage.getItem('cartItems'));

    const lastAddedItemIndex = storedItems.findIndex(item =>
      JSON.stringify(item.itemDetails) === JSON.stringify(itemDetails)
    );

    if (lastAddedItemIndex !== -1) {
      const updatedItems = [...storedItems];
      updatedItems[lastAddedItemIndex].quantity += 1;
      const updatedQuantities = {
        ...quantities,
        [itemName]: (quantities[itemName] || 0) + 1,
      };
      const variantDetails = storedItems[lastAddedItemIndex].variantDetails;
      setQuantities(updatedQuantities);
      setCartTotal(prev => prev + parseInt(variantDetails.price, 10));
      setItmsQuantity(prev => prev + 1);
      dispatch(updateQuantity({
        itemIndex: itemName,
        quantity: updatedItems[lastAddedItemIndex].quantity
      }));
      setRepeatLast(false);
      setOpenCart(true)
    } else {
      console.log("No matching item found in the cart.");
    }
  };
  return (
    <div>
      <div className="back_icon cursor-pointer p-2">
        <ArrowBackOutlinedIcon onClick={() => navigate("/")} />
      </div>
      <section className="font-semibold text-lg px-2">
        {selectedSectionName}
      </section>
      <hr className="my-2" />
      {sectionData &&
        sectionData.itemsData.map((item, itemIndex) => {
          const itemName = item.itemName;
          const quantityInCart = quantities[itemName] || 0;
          return (
            <div key={itemIndex}>
              <div className="grid grid-cols-12 items-center">
                <div className="p-4 col-span-8">
                  <div className="font-semibold">{itemName}</div>
                  <p className="tracking-widest font-semibold">
                    &#x20B9;
                    {item.itemPrice}
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
                          className="minus w-full text-center text-sm text-red-600 px-3"
                          onClick={() => handleSubtract(item, itemIndex)}
                        >
                          <FaMinus />
                        </p>
                        <div className="quantity w-full text-center h-8 text-black font-bold text-md bg-red-300 px-3">
                          <p className="mt-1">{quantityInCart}</p>
                        </div>
                        <p
                          className="plus w-full text-center text-sm px-3 text-red-600"
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
              <hr className="my-2 mx-2" />
            </div>
          );
        })}
      <div className="text-start mt-4 px-3 text-gray-600">
        <p>You May Also like to Order:</p>
      </div>
      <div className="bg-white p-3 ">
        <div className="carousel my-2">
          <div className="carousel-inner">
            <div className="card">
              {otherSections &&
                otherSections.map((section, index) => (
                  <Card
                    key={index}
                    variant="outlined"
                    onClick={() =>
                      navigate("/singleProduct", {
                        state: { sectionName: section },
                      })
                    }
                    className="suggestionCard hover:cursor-pointer card col-span-2 shadow-sm rounded-md  p-2 h-28 text-center subCategorySuggestionCard"
                  >
                    <div className="grid h-full content-between justify-items-start">
                      <div className="content col-span-12">{section} </div>
                    </div>
                  </Card>
                ))}
            </div>
          </div>
        </div>
      </div>
      <div
        className={`fixed ${openCart ? "bottom-24" : "bottom-2"} right-2  shadow-lg `}
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
        <div className="fixed bottom-2 left-1/2 transform -translate-x-1/2 w-full">
          <div
            className="p-2 bg-red-700 text-center mx-2 rounded-md text-white cursor-pointer"
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
        <div className="fixed bottom-0 py-3 bg-white shadow-lg rounded-t-lg h-fit border left-1/2 transform -translate-x-1/2 w-full">
          <div className="p-4">
            {selectedVariants.map((variant, index) => (
              <div key={index} className="flex justify-between p-2 border-b">
                <div>
                  <input
                    type="radio"
                    name="variant"
                    checked={selectedVariantIndex === index}
                    onChange={() => setSelectedVariantIndex(index)}
                  />
                  <span className="ml-2">{variant.unit}</span>
                </div>
                <span>&#x20B9;{variant.price}</span>
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
        </div>
      )}
      {repeatLast.status && (
        <div className="fixed bottom-0 h-fit py-3 bg-white shadow-lg rounded-t-lg  border left-1/2 transform -translate-x-1/2 w-full">
          <div className="p-4">
            {console.log(repeatLast)}
            <div className="text-red-600 my-1">Repeat Last used Customization</div>
            <hr className="my-1 border-black"></hr>
            <div className="flex justify-between p-2 border-b">
              <div>
                <span className="ml-2">{repeatLast?.itemDetails?.itemName} </span> <br />
                <span className="ml-2 text-md text-gray-400">Preperation :- {repeatLast?.variantsList?.unit} </span>
              </div>
              <span>&#x20B9;{repeatLast?.variantsList?.price}</span>
            </div>
          </div>
          <div className="flex gap-4 justify-center p-2 text-center">
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
        </div>
      )}
    </div>
  );
};
export default SingleProduct;
