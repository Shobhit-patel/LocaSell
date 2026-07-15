import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import API from "./wishlistApi.js";

export const getWishlist = createAsyncThunk(
  "wishlist/getWishlist",
  async (_, thunkAPI) => {
    try {
      const res = await API.get("/wishlist");
      return res.data.wishlist;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response.data);
    }
  }
);

export const toggleWishlist = createAsyncThunk(
  "wishlist/toggleWishlist",
  async ({ productId, product }, thunkAPI) => {
    try {
      const res = await API.post("/wishlist/toggle", {
        productId,
      });
      return {
        productId,
        product,
        action: res.data.action,
        message: res.data.message,
      };
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response.data);
    }
  }
);

const wishlistSlice = createSlice({
  name: "wishlist",

  initialState: {
    wishlist: [],
    loading: false,
    loadingProductId: null,
    error: null,
    message: '',
  },

  reducers: {
    clearMessage: (state) => {
      state.message = '';
    },
  },

  extraReducers: (builder) => {
    builder

      // Fetch Wishlist
      .addCase(getWishlist.pending, (state) => {
        state.loading = true;
      })

      .addCase(getWishlist.fulfilled, (state, action) => {
        state.loading = false;
        state.wishlist = action.payload;
      })

      .addCase(getWishlist.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Toggle Wishlist
      .addCase(toggleWishlist.pending, (state,action) => {
        state.loading = true;
        state.loadingProductId = action.meta.arg.productId
      })

      .addCase(toggleWishlist.fulfilled, (state, action) => {
        const { productId, product, action: type, message } = action.payload;

        state.loading = false;
        state.loadingProductId = null;
        state.message = message;

        if (type === "added") {
          state.wishlist.push(product);
        } else {
          state.wishlist = state.wishlist.filter(
            (item) => item._id !== productId
          );
        }
      })

      .addCase(toggleWishlist.rejected, (state, action) => {
        state.loading = false;
        state.loadingProductId = null;
        state.error = action.payload;
      });
  },
});

export const { clearMessage } = wishlistSlice.actions;
export default wishlistSlice.reducer;