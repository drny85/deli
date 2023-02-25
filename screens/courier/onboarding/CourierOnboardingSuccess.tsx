import React from 'react';
import Button from '../../../components/Button';
import Loader from '../../../components/Loader';
import Screen from '../../../components/Screen';
import Text from '../../../components/Text';
import { useCurrentUser } from '../../../hooks/useAuth';
import { setUserData } from '../../../redux/auth/authSlide';
import { useAppDispatch } from '../../../redux/store';

const CourierOnboardingSuccess = () => {
    const { currentUser, loading } = useCurrentUser();
    const dispatch = useAppDispatch();

    if (loading) return <Loader />;
    return (
        <Screen center>
            <Text lobster large animation={'fadeInDown'}>
                Congratulations {currentUser?.name}
            </Text>

            <Text py_8 animation={'fadeInLeft'} duration={600}>
                You are now ready to start earning some money
            </Text>

            <Button
                containerStyle={{ marginTop: 30 }}
                outlined
                title="Ready"
                onPress={() => {
                    dispatch(setUserData(currentUser));
                }}
            />
        </Screen>
    );
};

export default CourierOnboardingSuccess;
