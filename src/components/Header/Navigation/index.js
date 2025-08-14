import { Button } from "bootstrap-4-react/lib/components";
import { IoMenu } from "react-icons/io5";
import { FaAngleDown } from "react-icons/fa";
import { Link } from "react-router-dom";



const Navigation = () => {
  return (
    <nav>
      <div className="container">
        <div className="row">
          <div className="col-sm-3 navPart1">
            <Button className="allCartTab align-items-center">
              <span className="icon1 mr-2">
                <IoMenu />{" "}
              </span>

              <span class="text">ALL CATEGORIES</span>
              <span className="icon2 ml-2">
                <FaAngleDown />
              </span>
            </Button>
          </div>
          <div className="col-sm-9 navPart2 d-flex align-items-center">
            <ul className="list list-inline ml-auto">
              <li className="list-inline-item">
                {" "}
                <Link to="/"><Button>Home</Button></Link>
              </li>
              <li className="list-inline-item">
                <Link to="/"><Button>SkinCare-Products</Button></Link>
              </li>
              <li className="list-inline-item">
                <Link to="/"><Button>Plants</Button></Link>
              </li>
              <li className="list-inline-item">
                <Link to="/"><Button>Hand-Crafted Items</Button></Link>
              </li>
              <li className="list-inline-item">
                <Link to="/"><Button>Blog</Button></Link>
              </li>
              <li className="list-inline-item">
                <Link to="/"><Button>Contact Us</Button></Link>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </nav>
  );
};
export default Navigation;
