import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import ReactOwlCarousel from "react-owl-carousel";
import 'owl.carousel/dist/assets/owl.carousel.css';
import 'owl.carousel/dist/assets/owl.theme.default.css';

const HotCollections = () => {
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
          'https://us-central1-nft-cloud-functions.cloudfunctions.net/hotCollections'
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
    <section id="section-collections" className="no-bottom">
      <div className="container">
        <div className="row">
          <div className="col-lg-12">
            <div className="text-center">
              <h2>Hot Collections</h2>
              <div className="small-border bg-color-2"></div>
            </div>
          </div>

          {loading ? (
           
            <ReactOwlCarousel className="owl-theme" {...options}>
              {[1, 2, 3, 4].map((_, index) => (
                <div className="nft_coll" key={index}>
                  <div className="nft_wrap">
                    <div className="skeleton-box" style={{ width: "100%", height: "200px" }}></div>
                  </div>
                  <div className="nft_coll_pp">
                    <div className="skeleton-box" style={{ width: "50px", height: "50px", borderRadius: "50%" }}></div>
                    <i className="fa fa-check-circle"></i>
                  </div>
                  <div className="nft_coll_info">
                    <div className="skeleton-box" style={{ width: "100px", height: "20px", marginBottom: "5px" }}></div>
                    <br />
                    <div className="skeleton-box" style={{ width: "60px", height: "15px" }}></div>
                  </div>
                </div>
              ))}
            </ReactOwlCarousel>
          ) : (
           
            <ReactOwlCarousel className="owl-theme" key={apiData.length} {...options}>
              {apiData.map((coll) => (
                <div className="nft_coll" key={coll.id}>
                  <div className="nft_wrap">
                    <Link to={`/item-details/${coll.nftId}`}>
                      <img src={coll.nftImage} className="lazy img-fluid" alt={coll.title} />
                    </Link>
                  </div>
                  <div className="nft_coll_pp">
                    <Link to={`/author/${coll.authorId}`}>
                      <img className="lazy pp-coll" src={coll.authorImage} alt="Author" />
                    </Link>
                    <i className="fa fa-check-circle"></i>
                  </div>
                  <div className="nft_coll_info">
                    <Link to={`/item-details/${coll.nftId}`}>
                      <h4>{coll.title}</h4>
                    </Link>
                    <span>ERC-{coll.code}</span>
                  </div>
                </div>
              ))}
            </ReactOwlCarousel>
          )}
        </div>
      </div>
    </section>
  );
};

export default HotCollections;




