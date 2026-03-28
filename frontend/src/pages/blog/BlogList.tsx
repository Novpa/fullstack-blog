import { useEffect } from "react";
import api from "../../api/axiosInstance";

function BlogList() {
  useEffect(() => {
    const fetchBlogData = async () => {
      try {
        const res = await api.get("/blog");
        console.log(res);
      } catch (error) {
        console.log("bloglist", error);
      }
    };

    fetchBlogData();
  }, []);

  return (
    <div>
      <h1>Blog list</h1>
    </div>
  );
}

export default BlogList;
