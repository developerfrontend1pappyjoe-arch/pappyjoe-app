import {KeyboardAvoidingView, ScrollView, StyleSheet, View} from 'react-native';
import {ChipComponent} from './ChipComponent';
import {AddComplaintsDropdown} from './AddComplaintsDropdowns';
import React, {useEffect, useState} from 'react';
import {AddHistory} from '../../AddHistory';

import {BottomSheetModalProvider} from '@gorhom/bottom-sheet';
import {Text} from 'react-native-paper';
import CustomMultiselect from 'components/CustomMultiselect';
import {clinicalNotesMaster} from 'screens/AppoinmentsDetailsScreen/services/getClinicalNotesMaster';
import _ from 'lodash';
import {ComplaintLists} from './ComplaintLists';
import {DiagnosisLists} from './DiagnosisList';
import {HistoryLists} from './HistoryLists';
import {InvestigationLists} from './InvestigationLists';
import {NoteLists} from './NoteList';
import {ObservationLists} from './ObservationLists';

interface ClinicalNoteListProps {
  selectedData: any;
  handleSetSelected: () => void;
}

export const ClinicalNoteList = ({
  selectedData,
  handleSetSelected,
}: ClinicalNoteListProps) => {
  return (
    <KeyboardAvoidingView style={{flex: 1}}>
      <ScrollView
        style={styles.container}
        keyboardShouldPersistTaps={'handled'}>
        <ComplaintLists
          type="complaints"
          selectedData={selectedData.complaints}
          handleSetSelected={handleSetSelected}
        />
        <HistoryLists
          type="history"
          selectedData={selectedData.history}
          handleSetSelected={handleSetSelected}
        />
        <ObservationLists
          type="observation"
          selectedData={selectedData.observation}
          handleSetSelected={handleSetSelected}
        />
        <InvestigationLists
          type="investigation"
          selectedData={selectedData.investigation}
          handleSetSelected={handleSetSelected}
        />
        <DiagnosisLists
          type="diagnosis"
          selectedData={selectedData.diagnosis}
          handleSetSelected={handleSetSelected}
        />
        <NoteLists
          type="note"
          selectedData={selectedData.note}
          handleSetSelected={handleSetSelected}
        />
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingBottom: 100,
  },
});
