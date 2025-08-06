import { useEffect, useState } from "react";
import {
  addDoc,
  collection,
  serverTimestamp,
  onSnapshot,
  query,
  orderBy,
} from "firebase/firestore";
import { db, auth } from "../firebase/config";
import { useAuth } from "../context/AuthContext";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, LogOut } from "lucide-react";
import { signOut } from "firebase/auth";
import FeatureAvatar from "../assets/feature4.svg";

const Feed = () => {
  const { currentUser } = useAuth();
  const [content, setContent] = useState("");
  const [tags, setTags] = useState([]);
  const [posts, setPosts] = useState([]);
  const [loadingTags, setLoadingTags] = useState(false);
  const [error, setError] = useState("");

  const handlePost = async () => {
    if (!content.trim()) return;

    const displayName =
      currentUser?.displayName ||
      currentUser?.email?.split("@")[0] ||
      "Anonymous";

    try {
      await addDoc(collection(db, "posts"), {
        content,
        tags,
        createdAt: serverTimestamp(),
        author: {
          name: displayName,
          photoURL: "https://via.placeholder.com/150",
        },
      });
      setContent("");
      setTags([]);
      setError("");
    } catch (err) {
      setError("Failed to post. Please try again.");
      console.error(err);
    }
  };

  const handleLogout = async () => {
    await signOut(auth);
  };

  const handleSuggestHashtags = async () => {
    if (!content.trim()) return;
    setLoadingTags(true);
    setError("");

    try {
      const res = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/suggest-tags`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ content }),
        }
      );

      const data = await res.json();

      if (data.tags) {
        setTags(data.tags);
      } else {
        setError("No tags returned. Try refining your post.");
      }
    } catch (err) {
      console.error("Error fetching hashtags:", err);
      setError("Error fetching hashtags. Try again later.");
    } finally {
      setLoadingTags(false);
    }
  };

  useEffect(() => {
    const q = query(collection(db, "posts"), orderBy("createdAt", "desc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setPosts(data);
    });
    return () => unsubscribe();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-blue-50 to-purple-100">
      {/* Navbar */}
      <nav className="flex items-center justify-between px-6 py-4 bg-white/70 backdrop-blur-md shadow sticky top-0 z-10 border-b border-gray-200">
        <h1 className="text-xl font-semibold text-purple-600">🌐 EchoSphere</h1>
        <div className="flex items-center gap-4 text-sm">
          <span className="text-gray-700 hidden sm:inline">
            {currentUser?.displayName || currentUser?.email?.split("@")[0]}
          </span>
          <button
            onClick={handleLogout}
            className="flex items-center gap-1 text-red-500 hover:text-red-600"
          >
            <LogOut size={16} />
            Logout
          </button>
        </div>
      </nav>

      {/* Main Feed */}
      <div className="max-w-2xl mx-auto px-4 py-10 space-y-10">
        {/* Create Post */}
        <div className="bg-white/40 backdrop-blur-md rounded-xl shadow p-6 border border-gray-200">
          <h2 className="text-2xl font-semibold mb-4">Create Post</h2>
          <textarea
            className="w-full border border-gray-300 rounded-lg p-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-400 resize-none"
            placeholder="What's on your mind?"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={4}
          />

          {/* Error message */}
          {error && <p className="text-sm text-red-500 mt-2">{error}</p>}

          <div className="mt-3 flex items-center justify-between">
            <button
              className="flex items-center gap-2 border px-4 py-2 rounded-lg text-sm text-gray-600 hover:bg-gray-100 transition disabled:opacity-50"
              onClick={handleSuggestHashtags}
              disabled={loadingTags || !content.trim()}
            >
              <Sparkles className="h-4 w-4" />
              {loadingTags ? "Thinking..." : "Suggest Hashtags"}
            </button>
            <button
              onClick={handlePost}
              className="bg-purple-500 text-white px-6 py-2 rounded-xl font-semibold hover:bg-purple-600 transition disabled:opacity-50"
              disabled={!content.trim()}
            >
              Post
            </button>
          </div>

          {/* Suggested Tags */}
          {tags.length > 0 && (
            <div className="mt-4 flex flex-wrap gap-2">
              {tags.map((tag, idx) => (
                <span
                  key={idx}
                  className="bg-gray-200 text-gray-700 px-2 py-1 rounded-full text-sm"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Public Feed */}
        <div className="space-y-6">
          <h3 className="text-xl font-semibold">Public Feed</h3>

          <AnimatePresence>
            {posts.length === 0 ? (
              <motion.div
                key="no-posts"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="text-center text-gray-500 text-sm py-10"
              >
                🚫 No posts yet. Be the first to share something awesome!
              </motion.div>
            ) : (
              posts.map((post) => (
                <motion.div
                  key={post.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                  className="bg-white/40 backdrop-blur-md border border-gray-200 rounded-xl p-6 shadow"
                >
                  <div className="flex items-center gap-4 mb-3">
                    <img
  src={FeatureAvatar}
  alt="profile"
  className="w-10 h-10 rounded-full object-cover"
/>
                    <div>
                      <p className="font-semibold">{post.author.name}</p>
                      <p className="text-xs text-gray-500">
                        {post.createdAt?.toDate().toLocaleString() || "just now"}
                      </p>
                    </div>
                  </div>
                  <p className="text-gray-800 mb-3 whitespace-pre-wrap">
                    {post.content}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {post.tags?.map((tag, i) => (
                      <span
                        key={i}
                        className="bg-gray-100 text-gray-700 px-2 py-1 rounded-full text-sm"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </motion.div>
              ))
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default Feed;
