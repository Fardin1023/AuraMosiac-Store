import { FiSearch } from "react-icons/fi";
import { Button } from "bootstrap-4-react/lib/components";

const SearchBox = () => {
  return (
    <div className="headersearch ml-3 mr-3">
      <input type="text" placeholder="Search..." />
      <Button>
        <FiSearch />
      </Button>
    </div>
  );
};
export default SearchBox;
