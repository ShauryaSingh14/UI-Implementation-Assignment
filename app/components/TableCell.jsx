"use client";
import React, { useState, useRef, useCallback } from "react";
import Image from "next/image";
import { AddButton, TableCell } from "./Operations";
import { useDrag, useDrop } from "react-dnd";
import debounce from "lodash/debounce";

export const ItemTypes = {
  CARD: "card",
};

const TableRow = React.memo(
  ({ state, variants, removeState, index, id, addVariant, moveRow }) => {
    const [uploadedImages, setUploadedImages] = useState({});

    // Debounced image upload to prevent race conditions
    const handleImageUpload = useCallback(
      debounce((file, stateId, variantId) => {
        if (file) {
          const reader = new FileReader();
          reader.onloadend = () => {
            setUploadedImages((prev) => ({
              ...prev,
              [stateId]: {
                ...prev[stateId],
                [variantId]: { url: reader.result, name: file.name },
              },
            }));
          };
          reader.onerror = () => {
            console.error("Failed to read the file.");
          };
          reader.readAsDataURL(file);
        }
      }, 300),
      []
    );

    const handleFileChange = (event, stateId, variantId) => {
      const file = event.target.files[0];
      // Validate file type and size (e.g., max 2MB)
      if (
        file &&
        file.size <= 2 * 1024 * 1024 &&
        file.type.startsWith("image/")
      ) {
        handleImageUpload(file, stateId, variantId);
      } else {
        console.error("Invalid file type or file is too large");
      }
    };

    const ref = useRef(null);
    const [{ handlerId }, drop] = useDrop({
      accept: ItemTypes.CARD,
      collect(monitor) {
        return {
          handlerId: monitor.getHandlerId(),
        };
      },
      hover(item, monitor) {
        if (!ref.current) return;

        const dragIndex = item.index;
        const hoverIndex = index;

        if (dragIndex === hoverIndex) return;

        const hoverBoundingRect = ref.current.getBoundingClientRect();
        const hoverMiddleY =
          (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;
        const clientOffset = monitor.getClientOffset();
        const hoverClientY = clientOffset.y - hoverBoundingRect.top;

        if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) return;
        if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) return;

        moveRow(dragIndex, hoverIndex);
        item.index = hoverIndex;
      },
    });

    const [{ isDragging }, drag] = useDrag({
      type: ItemTypes.CARD,
      item: () => ({ id, index }),
      collect: (monitor) => ({
        isDragging: monitor.isDragging(),
      }),
    });

    const opacity = isDragging ? 0 : 1;
    drag(drop(ref));

    return (
      <tr
        key={state.id}
        className="h-[200px] group"
        style={{ opacity }}
        ref={ref}
        data-handler-id={handlerId}
      >
        <TableCell className="sticky-header left-0 border-none">
          <button
            onClick={() => removeState(state.id)}
            className="cursor-pointer flex-center transition-opacity duration-300 opacity-0 group-hover:opacity-100"
          >
            <Image
              src="/style.removeProduct.svg"
              alt="Remove"
              width={20}
              height={20}
              className="w-[20px] h-[20px]"
            />
          </button>
          <div className="flex-center gap-3">
            <h1 className="heading text-3xl md:text-4xl font-bold">
              {index + 1}
            </h1>
            <button className="cursor-pointer">
              <Image
                src="/style.dragdrop.png"
                alt="Drag"
                width={20}
                height={20}
                className="w-[20px] h-[20px]"
              />
            </button>
          </div>
        </TableCell>
        <TableCell className="sticky-header left-[75px]">
          <div className="flex-center gap-2 border-dashed border-TextGreyLight rounded-md cursor-pointer p-3 custom-shadow w-[300px] h-[160px] bg-white">
            <button className="filterButton flex-center gap-3">
              <Image
                src="/style.addProduct.svg"
                alt="Add"
                width={20}
                height={20}
                className="w-[20px] h-[20px]"
              />
              <p className="text-TextGrey">Add Product Filter</p>
            </button>
          </div>
        </TableCell>
        <TableCell colSpan={variants.length}>
          <div className="flex space-x-4 overflow-x-auto hidden-scrollbar">
            {variants.map((variant) => (
              <div key={variant.id} className="min-w-[200px]">
                <div className="flex-center gap-2 border-dashed border-TextGreyLight rounded-md cursor-pointer p-3 custom-shadow w-[180px] h-[160px] bg-white relative">
                  <input
                    type="file"
                    accept="image/*"
                    id={`file-upload-${state.id}-${variant.id}`}
                    style={{ display: "none" }}
                    onChange={(e) => handleFileChange(e, state.id, variant.id)}
                  />
                  {uploadedImages[state.id] &&
                  uploadedImages[state.id][variant.id] ? (
                    <label
                      htmlFor={`file-upload-${state.id}-${variant.id}`}
                      className="filterButton flex-center gap-3 cursor-pointer bg-white absolute transition-opacity duration-300 opacity-0 group-hover:opacity-100"
                    >
                      <Image
                        src="/style.uploadImg.svg"
                        alt="change"
                        width={20}
                        height={20}
                        className="w-[20px] h-[20px]"
                      />
                    </label>
                  ) : (
                    <label
                      htmlFor={`file-upload-${state.id}-${variant.id}`}
                      className="filterButton flex-center gap-3 cursor-pointer bg-white absolute"
                    >
                      <Image
                        src="/style.addProduct.svg"
                        alt="Upload"
                        width={20}
                        height={20}
                        className="w-[20px] h-[20px]"
                      />
                      <p className="text-TextGrey">Add design</p>
                    </label>
                  )}
                  {uploadedImages[state.id] &&
                    uploadedImages[state.id][variant.id] && (
                      <div className="flex flex-col items-center gap-2">
                        <Image
                          src={uploadedImages[state.id][variant.id].url}
                          alt={uploadedImages[state.id][variant.id].name}
                          width={100}
                          height={100}
                          className="w-[100px] h-[100px] object-cover"
                        />
                        <h6 className="text-TextGrey">
                          {uploadedImages[state.id][variant.id].name.length > 10
                            ? `${uploadedImages[state.id][
                                variant.id
                              ].name.substring(0, 10)}...`
                            : uploadedImages[state.id][variant.id].name}
                        </h6>
                      </div>
                    )}
                </div>
              </div>
            ))}
          </div>
        </TableCell>
        <TableCell className="border-none">
          <AddButton onClick={addVariant} />
        </TableCell>
      </tr>
    );
  }
);

export default TableRow;
