import { FlatList, ListRenderItem, TouchableOpacity, View } from 'react-native';
import React, { useEffect } from 'react';
import Screen from '../../../components/Screen';
import Text from '../../../components/Text';
import { useBusinessAvailable } from '../../../hooks/useBusinessAvailable';
import Loader from '../../../components/Loader';
import { Business, setBusiness } from '../../../redux/business/businessSlide';
import { useAppDispatch } from '../../../redux/store';

import { useNavigation } from '@react-navigation/native';
import BusinessCard from '../../../components/BusinessCard';
import { LOCATION_TASK_NAME, useLocation } from '../../../hooks/useLocation';
import * as TaskManager from 'expo-task-manager';
type Props = {};

const Businesses = ({}: Props) => {
   const { businessAvailable, isLoading } = useBusinessAvailable();
   useLocation();
   const dispatch = useAppDispatch();
   const navigation = useNavigation();
   const renderBusinesses: ListRenderItem<Business> = ({ item }) => {
      return (
         <BusinessCard
            business={item}
            onPress={() => {
               dispatch(setBusiness(item));
               navigation.navigate('ConsumerHome', {
                  screen: 'BusinessPage'
               });
            }}
         />
      );
   };
   console.log(isLoading);

   useEffect(() => {}, []);
   if (isLoading) return <Loader />;

   return (
      <Screen>
         <FlatList
            data={businessAvailable}
            keyExtractor={(item) => item.id!}
            renderItem={renderBusinesses}
         />
      </Screen>
   );
};

export default Businesses;
