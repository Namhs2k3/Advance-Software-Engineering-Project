import { useState } from "react";
import OrderMenu from "./OrderMenu";

const OrderTable = () => {
  const [tables] = useState([
    { id: 1, name: "Bàn 1", orders: [] },
    { id: 2, name: "Bàn 2", orders: [] },
    { id: 3, name: "Bàn 3", orders: [] },
    { id: 4, name: "Bàn 4", orders: [] },
    { id: 5, name: "Bàn 5", orders: [] },
    { id: 6, name: "Bàn 6", orders: [] },
    { id: 7, name: "Bàn 7", orders: [] },
  ]);
  const [selectedTable, setSelectedTable] = useState(null);

  return (
    <div className="flex">
      {/* Bên trái: Danh sách bàn */}
      <div className="w-1/2 border-r border-gray-300 p-4">
        <h2 className="mb-4 text-2xl font-bold">Danh sách bàn</h2>
        <div className="grid grid-cols-3 items-start gap-4">
          {tables.map((table) => (
            <div
              key={table.id}
              className={`cursor-pointer rounded-md border p-6 text-center ${
                selectedTable?.id === table.id
                  ? "bg-[#633c02] text-white"
                  : "bg-white text-gray-800"
              } hover:bg-[#d88453]`}
              onClick={() => setSelectedTable(table)}
            >
              {table.name}
            </div>
          ))}
        </div>
      </div>

      {/* Bên phải: Thực đơn */}
      <div className="w-2/3">
        <OrderMenu selectedTable={selectedTable} />
      </div>
    </div>
  );
};

export default OrderTable;
