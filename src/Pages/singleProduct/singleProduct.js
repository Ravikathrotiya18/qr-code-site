import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import ArrowBackOutlinedIcon from "@mui/icons-material/ArrowBackOutlined";
import { Card } from "@mui/material";
import { FaMinus, FaPlus } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import CurrencyRupeeIcon from "@mui/icons-material/CurrencyRupee";
import { addItem } from "../../app/features/Cart/CartSlice";
import "./singleProduct.css";

const SingleProduct = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { sectionName: selectedSectionName } = location.state;

  const [open, setOpen] = useState(false);
  const [quantities, setQuantities] = useState({});
  const [dataFetched, setDataFetched] = useState(false);
  const [openCart, setOpenCart] = useState(false);
  const dispatch = useDispatch();
  const handleAdd = (itemIndex) => {
    setOpenCart(true);
    if (quantities[itemIndex] === undefined) {
      handleAddQuantities(itemIndex);
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

  const sectionnameWiseData = [
    {
      sectionName: "Hotdog",
      itemsData: [
        {
          itemName: "Butter Hotdog",
          itemPrice: "65",
          itemDescription: "Potato Masala, onion, tomato",
          variants: [
            {
              unit: "small",
              price: "45",
            },
            {
              unit: "big",
              price: "95",
            },
            {
              unit: "regular",
              price: "65",
            },
          ],
        },
        {
          itemName: "Cheese Hotdog",
          itemPrice: "75",
          itemDescription: "Cheese, lettuce, mustard",
        },
        {
          itemName: "Spicy Hotdog",
          itemPrice: "70",
          itemDescription: "Jalapenos, spicy sauce, onions",
        },
        {
          itemName: "Classic Hotdog",
          itemPrice: "60",
          itemDescription: "Ketchup, mustard, relish",
        },
        {
          itemName: "Classic Garlic Bread",
          itemPrice: "40",
          itemDescription: "Garlic, butter, parsley",
        },
        {
          itemName: "Cheesy Garlic Bread",
          itemPrice: "55",
          itemDescription: "Garlic, butter, mozzarella cheese",
        },
        {
          itemName: "Spicy Garlic Bread",
          itemPrice: "50",
          itemDescription: "Garlic, butter, chili flakes",
        },
        {
          itemName: "Herb Garlic Bread",
          itemPrice: "45",
          itemDescription: "Garlic, butter, mixed herbs",
        },
      ],
    },
    {
      sectionName: "Burger",
      itemsData: [
        {
          itemName: "Cheeseburger",
          itemPrice: "85",
          itemDescription: "Beef patty, cheese, lettuce, tomato",
        },
        {
          itemName: "Veggie Burger",
          itemPrice: "75",
          itemDescription: "Veggie patty, lettuce, tomato, onion",
        },
        {
          itemName: "Bacon Burger",
          itemPrice: "95",
          itemDescription: "Beef patty, bacon, cheese, BBQ sauce",
        },
        {
          itemName: "Chicken Burger",
          itemPrice: "80",
          itemDescription: "Chicken patty, lettuce, mayo",
        },
      ],
    },
    {
      sectionName: "Pizza",
      itemsData: [
        {
          itemName: "Margherita Pizza",
          itemPrice: "120",
          itemDescription: "Tomato, mozzarella, basil",
        },
        {
          itemName: "Pepperoni Pizza",
          itemPrice: "150",
          itemDescription: "Pepperoni, mozzarella, tomato sauce",
        },
        {
          itemName: "Veggie Pizza",
          itemPrice: "130",
          itemDescription: "Bell peppers, onions, olives, mushrooms",
        },
        {
          itemName: "BBQ Chicken Pizza",
          itemPrice: "160",
          itemDescription: "BBQ chicken, onions, cilantro",
        },
      ],
    },
    {
      sectionName: "Toast sandwich",
      itemsData: [
        {
          itemName: "Cheese Toast Sandwich",
          itemPrice: "50",
          itemDescription: "Cheese, tomato, lettuce",
        },
        {
          itemName: "Ham Toast Sandwich",
          itemPrice: "70",
          itemDescription: "Ham, cheese, mustard",
        },
        {
          itemName: "Chicken Toast Sandwich",
          itemPrice: "75",
          itemDescription: "Chicken, lettuce, mayo",
        },
        {
          itemName: "Veggie Toast Sandwich",
          itemPrice: "60",
          itemDescription: "Lettuce, tomato, cucumber, avocado",
        },
      ],
    },
    {
      sectionName: "Garlic Bread",
      itemsData: [
        {
          itemName: "Classic Garlic Bread",
          itemPrice: "40",
          itemDescription: "Garlic, butter, parsley",
        },
        {
          itemName: "Cheesy Garlic Bread",
          itemPrice: "55",
          itemDescription: "Garlic, butter, mozzarella cheese",
        },
        {
          itemName: "Spicy Garlic Bread",
          itemPrice: "50",
          itemDescription: "Garlic, butter, chili flakes",
        },
        {
          itemName: "Herb Garlic Bread",
          itemPrice: "45",
          itemDescription: "Garlic, butter, mixed herbs",
        },
      ],
    },
    {
      sectionName: "French Fries",
      itemsData: [
        {
          itemName: "Classic French Fries",
          itemPrice: "45",
          itemDescription: "Salt, ketchup",
        },
        {
          itemName: "Cheese Fries",
          itemPrice: "60",
          itemDescription: "Cheese, salt",
        },
        {
          itemName: "Spicy Fries",
          itemPrice: "50",
          itemDescription: "Chili powder, salt",
        },
        {
          itemName: "Garlic Fries",
          itemPrice: "55",
          itemDescription: "Garlic, parsley, salt",
        },
      ],
    },
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
        console.log(parsedData);
        const updatedQuantities = { ...quantities };
        parsedData.forEach(({ itemIndex, quantity }) => {
          updatedQuantities[itemIndex] = quantity;
        });

        setQuantities(updatedQuantities);
        setOpenCart(true);
      }
      setDataFetched(true);
    }
  }, [dataFetched]);

  const handleOpen = () => setOpen(!open);

  const handleAddQuantities = (itemIndex) => {
    const updatedQuantities = {
      ...quantities,
      [itemIndex]: (quantities[itemIndex] || 0) + 1,
    };
    setQuantities(updatedQuantities);
    managedCart(itemIndex, updatedQuantities[itemIndex]);
  };

  const managedCart = (itemIndex, quantity) => {
    dispatch(
      addItem({
        itemIndex,
        quantity,
        itemDetails: sectionData.itemsData[itemIndex],
      })
    );
  };

  const handleSubtract = (itemIndex) => {
    const updatedQuantities = {
      ...quantities,
    };

    if (updatedQuantities[itemIndex] > 1) {
      updatedQuantities[itemIndex] -= 1;
    } else {
      delete updatedQuantities[itemIndex];
      setOpenCart(Object.keys(updatedQuantities).length > 0);
    }

    setQuantities(updatedQuantities);
    managedCart(itemIndex, updatedQuantities[itemIndex] || 0);
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
        sectionData.itemsData.map((item, itemIndex) => (
          <div key={itemIndex}>
            <div className="grid grid-cols-12 items-center">
              <div className="p-4 col-span-8">
                <div className="font-semibold">{item.itemName}</div>
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
                  {quantities[itemIndex] ? (
                    <div className="flex items-center overflow-hidden rounded-lg shadow-md">
                      <p
                        className="minus w-full text-center text-sm text-red-600 px-3"
                        onClick={() => handleSubtract(itemIndex)}
                      >
                        <FaMinus />
                      </p>
                      <div className="quantity w-full text-center h-8  text-black font-bold text-md bg-red-400 px-3">
                        <p className="mt-1">{quantities[itemIndex]}</p>
                      </div>
                      <p
                        className="plus w-full text-center text-sm px-3 text-red-600"
                        onClick={() => handleAddQuantities(itemIndex)}
                      >
                        <FaPlus />
                      </p>
                    </div>
                  ) : (
                    <div className="flex items-center overflow-hidden rounded-lg shadow-md">
                      <div
                        className="minus w-full text-center text-md p-1 px-3 font-bold"
                        onClick={() => handleAdd(itemIndex)}
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
        ))}
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
        className={`fixed ${openCart ? "bottom-24" : "bottom-2"
          } right-2  shadow-lg `}
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
          className={`p-2 bg-blue-600 text-center w-32 rounded-lg shadow-lg text-white cursor-pointer ${open ? "marginLeft" : ""
            }`}
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
                <p className="text-md tracking-widest">1 items</p>
                <p className="text-xl font-medium text-start tracking-wider">
                  &#x20B9;200
                </p>
              </div>
              <div className="text-xl tracking-wider">View Cart ⮞</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SingleProduct;
