import { FilePlus2 } from "lucide-react";
import React from "react";

interface AddNewRecordBtnProps {
  onOpen: () => void;
}

const AddNewRecordBtn: React.FC<AddNewRecordBtnProps> = ({ onOpen }) => {
  return (
    <div className="new-tb-entry-btn-div">
      <button className="new-tb-entry-btn" onClick={onOpen}>
        <FilePlus2 size={20} />
        New Entry
      </button>
    </div>
  );
};

export default AddNewRecordBtn;
