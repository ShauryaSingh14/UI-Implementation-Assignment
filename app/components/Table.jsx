"use client";
import React, { useCallback, useState } from "react";
import { AddButton, TableCell } from "./Operations";
import update from "immutability-helper";
import Image from "next/image";
import TableRow from "./TableCell";
import toast, { Toaster } from "react-hot-toast";
import { v4 as uuidv4 } from "uuid";

// Extracted TableRow and Column components for better decomposition and clarity
const Column = ({ variant, onRemoveVariant }) => (
  <div
    key={variant.id}
    className="min-w-[200px] flex items-center justify-between gap-3 border-r"
  >
    {/* Left aligned: Variant name */}
    <p className="text-TextGrey">{variant.name}</p>

    {/* Right aligned: Remove and More buttons */}
    <div className="flex items-center space-x-2">
      {/* Remove variant button */}
      <button
        onClick={() => onRemoveVariant(variant.id)}
        className="cursor-pointer"
      >
        <Image
          src="/style.removeProduct.svg"
          alt="Remove"
          width={15}
          height={15}
          className="w-[15px] h-[15px]"
        />
      </button>

      {/* More variant button */}
      <button className="cursor-pointer">
        <Image
          src="/style.moreVariant.svg"
          alt="More"
          width={20}
          height={20}
          className="w-[20px] h-[20px]"
        />
      </button>
    </div>
  </div>
);

const Table = () => {
  // For managing the row data
  const [rows, setRows] = useState([{ id: uuidv4(), name: "1" }]);
  // For managing the column data
  const [columns, setColumns] = useState([
    { id: uuidv4(), name: "Primary Variant" },
  ]);

  // For adding a new row
  const addRow = () => {
    const newRow = { id: uuidv4(), name: `${rows.length + 1}` };
    setRows((previousRows) => [...previousRows, newRow]);
    toast.success("State added");
  };

  // For removing a row
  const removeRow = (id) => {
    setRows((previousRows) => previousRows.filter((row) => row.id !== id));
    toast.error("State removed");
  };

  // For adding a new column
  const addColumn = () => {
    const newColumn = { id: uuidv4(), name: `Variant ${columns.length + 1}` };
    setColumns((previousColumns) => [...previousColumns, newColumn]);
    toast.success("Variant added");
  };

  // For removing a column
  const removeColumn = (id) => {
    setColumns((previousColumns) =>
      previousColumns.filter((column) => column.id !== id)
    );
    toast.error("Variant removed");
  };

  // moveRow for drag and drop functionality
  const moveRow = useCallback((dragIndex, hoverIndex) => {
    setRows((previousRows) =>
      update(previousRows, {
        $splice: [
          [dragIndex, 1],
          [hoverIndex, 0, previousRows[dragIndex]],
        ],
      })
    );
  }, []);

  return (
    <div className="container bg-[#F9FBFC] mx-auto my-4 p-4 border border-TextGreyLight rounded-lg">
      <div className="overflow-x-auto">
        <table className="max-w-full">
          <thead>
            <tr>
              <TableCell className="sticky-header left-0 border-none w-[80px]">
                {" "}
              </TableCell>
              <TableCell
                style={{ backgroundColor: "#f8fafc" }}
                className="text-TextGrey w-[300px] sticky-header left-[80px]"
              >
                Product Filter
              </TableCell>

              <TableCell className="max-w-[600px]">
                <div className="flex items-center">
                  {/* Display columns with remove and more buttons on the right */}
                  {columns.map((column) => (
                    <Column
                      key={column.id}
                      variant={column}
                      onRemoveVariant={removeColumn}
                    />
                  ))}
                </div>
              </TableCell>
            </tr>
          </thead>
          <tbody>
            {rows.map((row, index) => (
              <TableRow
                key={row.id}
                index={index}
                id={row.id}
                state={row}
                variants={columns}
                removeState={removeRow}
                addVariant={addColumn}
                moveRow={moveRow}
              />
            ))}
          </tbody>
          <tfoot>
            <tr>
              <TableCell className="sticky-header left-0">
                <AddButton onClick={addRow} />
              </TableCell>
            </tr>
          </tfoot>
        </table>
      </div>
      <Toaster />
    </div>
  );
};

export default Table;
