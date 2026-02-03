import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';

import axiosClient from './utils/axiosClient';

export const registerUser=createAsyncThunk(
  // action type prefix
  //--  slice/action
  'auth/register',
  async(userData, {rejectWithValue})=>{
    try{
      const response= await axiosClient.post('/user/register',userData);
      return response.data.user;
    }catch(error){
      return rejectWithValue(error);
    }

  }
);


export const loginUser=createAsyncThunk(
  'auth/login',
  async(credentials,{rejectWithValue})=>{
    try{
      const response=await axiosClient.post('/user/login',credentials);
      return response.data.user;
    }catch(error){
      return rejectWithValue(error);
    }
  }
);