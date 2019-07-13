import React, { Component } from 'react';
import { ScrollView } from 'react-native';
import { SafeAreaView } from 'react-navigation';
import { connect } from 'react-redux';
import { Ionicons } from '@expo/vector-icons';
import { onLogout } from '../actions/AuthActions';
import { DrawerItem } from '../components/common';
class CommerceDrawerContent extends Component {
    leftIcon = name => (
        <Ionicons name={name} size={20} color="black" style={{ marginRight: 8 }} />
    );

    render() {
        return (
            <ScrollView>
                <SafeAreaView
                    style={{ flex: 1 }}
                    forceInset={{ top: 'always', horizontal: 'never' }}
                >
                    <DrawerItem
                        title="Ser Cliente"
                        icon={this.leftIcon('md-person')}
                        onPress={() => this.props.navigation.navigate('client')}
                    />
                    <DrawerItem
                        title="Cerrar Sesion"
                        icon={this.leftIcon('md-exit')}
                        loading={this.props.loading}
                        onPress={() => this.props.onLogout()}
                    />
                </SafeAreaView>
            </ScrollView>
        );
    }
}

const mapStateToProps = state => {
    return { loading: state.auth.loading };
}

export default connect(mapStateToProps, { onLogout })(CommerceDrawerContent);