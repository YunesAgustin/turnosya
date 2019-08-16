import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Card, CheckBox, ButtonGroup, Divider } from 'react-native-elements';
import { View, StyleSheet, Text } from 'react-native';
import { MAIN_COLOR } from '../constants';
import { onScheduleValueChange, onScheduleCardValueChange } from '../actions';
import { CardSection, DatePicker } from './common';

class RegisterSchedule extends Component {
  state = {
    checked: false,
    prevDays: [],
    firstCloseError: '',
    secondOpenError: '',
    secondCloseError: ''
  };

  async componentDidMount() {
    await this.setState({
      checked: !!this.props.card.secondOpen,
      prevDays: this.props.card.days
    });
  }

  getDisabledCheckBox = () =>
    this.props.card.firstClose === '' || this.state.firstCloseError !== '';

  getDisabledSecondPickerClose = () =>
    !this.props.card.secondOpen || this.state.secondOpenError !== '';

  renderPickerFirstClose = value => {
    const { firstOpen } = this.props.card;
    if (firstOpen < value) {
      this.setState({ firstCloseError: '' });
    } else {
      this.setState({
        firstCloseError: `Hora de cierre debe ser \n mayor a la de apertura`
      });
    }
  };

  renderPickerSecondOpen = value => {
    const { firstClose } = this.props.card;

    if (value > firstClose) {
      this.setState({ secondOpenError: '' });
    } else {
      this.setState({
        secondOpenError: `Segundo turno debe \n ser mayor al primero`
      });
    }
  };

  renderPickerSecondClose = value => {
    const { secondOpen } = this.props.card;

    if (secondOpen < value) {
      this.setState({ secondCloseError: '' });
    } else {
      this.setState({
        secondCloseError: `Hora de cierre debe ser \n mayor a la de apertura`
      });
    }
  };

  getDisableDays = () => {
    return this.props.selectedDays.filter(
      day => !this.props.card.days.includes(day)
    );
  };

  updateIndex = selectedIndexes => {
    const { card, selectedDays, onScheduleCardValueChange, onScheduleValueChange } = this.props;
    onScheduleCardValueChange({ id: card.id, days: selectedIndexes });

    const newValue = selectedIndexes
      .concat(this.state.prevDays)
      .filter((value, index, array) => array.indexOf(value) === index);

    if (newValue.length != this.state.prevDays.length) {
      //Significa que seleccionó un nuevo día

      onScheduleValueChange({
        prop: 'selectedDays',
        value: selectedDays
          .concat(selectedIndexes)
          .filter((value, index, array) => array.indexOf(value) === index)
      });
    } else {
      //Significa que borró un día

      const valueErased = this.state.prevDays.filter(
        day => !selectedIndexes.includes(day)
      );

      onScheduleValueChange({
        prop: 'selectedDays',
        value: selectedDays.filter(day => !valueErased.includes(day))
      });
    }

    this.setState({ prevDays: selectedIndexes });
  };

  onSecondTurnPress = () => {
    this.props.onScheduleCardValueChange({ id: this.props.card.id, secondOpen: '', secondClose: '' });
    this.setState({ checked: !this.state.checked });
  };

  renderSecondTurn() {
    if (this.state.checked) {
      return (
        <CardSection style={styles.viewPickerDate}>
          <DatePicker
            date={this.props.card.secondOpen}
            mode="time"
            placeholder="Hora de apertura"
            onDateChange={value => {
              this.props.onScheduleCardValueChange({ id: this.props.card.id, secondOpen: value });
              this.renderPickerSecondOpen(value);
            }}
            errorMessage={this.state.secondOpenError}
          />

          <DatePicker
            date={this.props.card.secondClose}
            placeholder="Hora de cierre"
            onDateChange={value => {
              this.props.onScheduleCardValueChange({ id: this.props.card.id, secondClose: value });
              this.renderPickerSecondClose(value);
            }}
            disabled={this.getDisabledSecondPickerClose()}
            errorMessage={this.state.secondCloseError}
          />
        </CardSection>
      );
    }
  }

  render() {
    const buttons = ['D', 'L', 'M', 'M', 'J', 'V', 'S'];
    
    return (
      <View>
        <Card containerStyle={styles.cardStyle} title="Horarios">
          <CardSection style={styles.viewPickerDate}>
            <DatePicker
              date={this.props.card.firstOpen}
              placeholder="Hora de apertura"
              onDateChange={value => {
                this.props.onScheduleCardValueChange({ id: this.props.card.id, firstOpen: value });
              }}
            />
            <DatePicker
              date={this.props.card.firstClose}
              placeholder="Hora de cierre"
              onDateChange={value => {
                this.props.onScheduleCardValueChange({ id: this.props.card.id, firstClose: value });
                this.renderPickerFirstClose(value);
              }}
              disabled={!this.props.card.firstOpen}
              errorMessage={this.state.firstCloseError}
            />
          </CardSection>

          {this.renderSecondTurn()}

          <CardSection>
            <CheckBox
              containerStyle={{ flex: 1 }}
              title="Agregar segundo turno"
              iconType="material"
              checkedIcon="clear"
              uncheckedIcon="add"
              checkedColor={MAIN_COLOR}
              uncheckedColor={MAIN_COLOR}
              checkedTitle="Borrar segundo turno"
              checked={this.state.checked}
              onPress={this.onSecondTurnPress}
              disabled={this.getDisabledCheckBox()}
            />
          </CardSection>

          <CardSection>
            <ButtonGroup
              onPress={index => this.updateIndex(index)}
              selectedIndexes={this.props.card.days}
              disabled={this.getDisableDays()}
              buttons={buttons}
              selectMultiple
              containerStyle={{ borderWidth: 0, height: 50 }}
              innerBorderStyle={{ width: 0 }}
              buttonStyle={{
                borderWidth: 2,
                borderColor: 'white',
                borderRadius: 25,
                width: 50
              }}
              selectedButtonStyle={{ backgroundColor: MAIN_COLOR }}
            />
          </CardSection>
        </Card>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  viewPickerDate: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center'
  },
  cardStyle: {
    padding: 5,
    paddingTop: 10,
    borderRadius: 10
  }
});

const mapStateToProps = state => {
  const { selectedDays } = state.registerSchedule;

  return {
    selectedDays
  };
};

export default connect(
  mapStateToProps,
  {
    onScheduleValueChange,
    onScheduleCardValueChange
  }
)(RegisterSchedule);
