import React, { Fragment, useContext, useEffect } from 'react';
import ContactContext from '../../context/contact/contactContext';
import ContactItem from '../contacts/ContactItem';
import Spinner from '../layout/Spinner'
import {CSSTransition, TransitionGroup} from 'react-transition-group'

const Contacts = props => {
    const { contacts, filtered, getContacts, loading } = useContext(ContactContext);

    useEffect(() => {
        getContacts();
    }, []);

    if (contacts !== null && contacts.length === 0 && !loading) {
        return <h4>Please add a Contact</h4>
    }

    return (
        <Fragment>
            {contacts !== null && !loading ? (
                <TransitionGroup>
                {
                    filtered !== null ? filtered.map(contact => (
                        <CSSTransition key={contact._id} timeout={500} classNames='item' >
                            <ContactItem contact={contact} />
                        </CSSTransition>
                    )) : contacts.map(contact => (
                        <CSSTransition key={contact._id} timeout={500} classNames='item' >
                            <ContactItem contact={contact} />
                        </CSSTransition>
                    ))
                }
                </TransitionGroup>
            ) : <Spinner /> }
        </Fragment>
    )
}

Contacts.propTypes = {

}

export default Contacts
