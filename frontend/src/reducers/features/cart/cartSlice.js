import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import API from "./cartApi.js";

export const getCart = createAsyncThunk(
  "cart/getCart",
  async (_, thunkAPI) => {
    try {
      const res = await API.get("/cart");
      return res.data.cart;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response.data);
    }
  }
);

export const toggleCart = createAsyncThunk(
  "cart/toggleCart",
  async ({ productId, product }, thunkAPI) => {
    try {
      const res = await API.post("/cart/toggle", {
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

const cartSlice = createSlice({
  name: "cart",

  initialState: {
    cart: [],
    loading: false,
    error: null,
    message: '',
  },

  reducers: {},

  extraReducers: (builder) => {
    builder

      // Fetch Cart
      .addCase(getCart.pending, (state) => {
        state.loading = true;
      })

      .addCase(getCart.fulfilled, (state, action) => {
        state.loading = false;
        state.cart = action.payload;
      })

      .addCase(getCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Toggle cart
      .addCase(toggleCart.fulfilled, (state, action) => {
        const { productId, product, action: type, message } = action.payload;
        
        state.message = message;

        if (type === "added") {
          state.cart.push(product);
        } else {
          state.cart = state.cart.filter(
            (item) => item._id !== productId
          );
        }
      });
  },
});

export default cartSlice.reducer;
