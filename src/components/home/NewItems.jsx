import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import AuthorImage from "../../images/author_thumbnail.jpg";
import nftImage from "../../images/nftImage.jpg";
import axios from "axios";
import ReactOwlCarousel from "react-owl-carousel";
import 'owl.carousel/dist/assets/owl.carousel.css';
import 'owl.carousel/dist/assets/owl.theme.default.css';


const CountdownClock = ({ expiryDate }) => {
  const [timeLeft, setTimeLeft] = useState("");

  useEffect(() => {
    if (!expiryDate) return;

    const calculateTime = () => {
      const millisecondsLeft = expiryDate - Date.now();

      if (millisecondsLeft <= 0) {
        setTimeLeft("Auction Over");
        return;
      }

      const totalSeconds = Math.floor(millisecondsLeft / 1000);
      const totalMinutes = Math.floor(totalSeconds / 60);
      
      const seconds = Math.floor(totalSeconds % 60).toString().padStart(2, "0");
      const minutes = Math.floor(totalMinutes % 60).toString().padStart(2, "0");
      const hours = Math.floor(totalMinutes / 60).toString().padStart(2, "0");

      setTimeLeft(`${hours}:${minutes}:${seconds}`);
    };

   
    calculateTime(); 
    
  
    const timer = setInterval(calculateTime, 1000); 

   
    return () => clearInterval(timer); 
  }, [expiryDate]);

  return <div className="de_countdown">{timeLeft}</div>;
};

const NewItems = () => {
  const options = {
    items: 4,
    loop: true,
    margin: 10,
    nav: true,
    dots: false,
    responsive: {
      0: { items: 1 },
      600: { items: 2 },
      1000: { items: 4 },
    },
  };

  const [apiData, setApiData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchNFT() {
      try {
        const { data } = await axios.get(
          'https://us-central1-nft-cloud-functions.cloudfunctions.net/newItems'
        );
        if (data) {
          setApiData(data);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchNFT();
  }, []);

return (
    <section id="section-items" className="no-bottom">
      <div className="container">
        <div className="row">
          <div className="col-lg-12">
            <div className="text-center">
              <h2>New Items</h2>
              <div className="small-border bg-color-2"></div>
            </div>
          </div>
            {loading ? (
            <ReactOwlCarousel className="owl-theme" {...options}>
              {Array.from({ length: 4 }).map((_, index) => (
                <div className="nft__item" key={index}>
                  <div className="author_list_pp">
                    <div 
                      className="skeleton-box" 
                      style={{ width: "50px", height: "50px", borderRadius: "50%" }}
                    ></div>
                    <i className="fa fa-check"></i>
                  </div>
                  <div className="nft__item_wrap">
                    <div 
                      className="skeleton-box" 
                      style={{ width: "100%", height: "200px", borderRadius: "8px" }}
                    ></div>
                  </div>
                  <div className="nft__item_info">
                    <div 
                      className="skeleton-box" 
                      style={{ width: "80%", height: "20px", marginBottom: "10px" }}
                    ></div>
                    <div 
                      className="skeleton-box" 
                      style={{ width: "40%", height: "15px" }}
                    ></div>
                  </div>
                </div>
              ))}
            </ReactOwlCarousel>
          ) : (
          <ReactOwlCarousel className="owl-theme" key={apiData.length} {...options}>
          {apiData.map((nft) => 
              <div className="nft__item" key={nft.nftId}>
                <div className="author_list_pp">
                  <Link
                    to="/author"
                    data-bs-toggle="tooltip"
                    data-bs-placement="top"
                    title="Creator: Monica Lucas"
                  >
                    <img className="lazy" src={nft.authorImage} alt="" />
                    <i className="fa fa-check"></i>
                  </Link>
                </div>
                {nft.expiryDate && <CountdownClock expiryDate={nft.expiryDate} />}

                <div className="nft__item_wrap">
                  <div className="nft__item_extra">
                    <div className="nft__item_buttons">
                      <button>Buy Now</button>
                      <div className="nft__item_share">
                        <h4>Share</h4>
                        <a href="" target="_blank" rel="noreferrer">
                          <i className="fa fa-facebook fa-lg"></i>
                        </a>
                        <a href="" target="_blank" rel="noreferrer">
                          <i className="fa fa-twitter fa-lg"></i>
                        </a>
                        <a href="">
                          <i className="fa fa-envelope fa-lg"></i>
                        </a>
                      </div>
                    </div>
                  </div>
                  <Link to="/item-details">
                    <img
                      src={nft.nftImage}
                      className="lazy nft__item_preview"
                      alt=""
                    />
                  </Link>
                </div>
                <div className="nft__item_info">
                  <Link to="/item-details">
                    <h4>{nft.title}</h4>
                  </Link>
                  <div className="nft__item_price">{nft.price} ETH</div>
                  <div className="nft__item_like">
                    <i className="fa fa-heart"></i>
                    <span>{nft.likes}</span>
                  </div>
                </div>
              </div>
          )}
          </ReactOwlCarousel>
          )}
        </div>
      </div>
    </section>
  );
};

export default NewItems;

