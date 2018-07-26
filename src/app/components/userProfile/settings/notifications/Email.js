import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import is from 'styled-is';

import { Form, Field } from 'react-final-form';
import tt from 'counterpart';

import { CardContent, CardDivider } from 'golos-ui/Card';
import { DialogFooter, DialogButton } from 'golos-ui/Dialog';
import {
    FormGroup,
    FormGroupRow as StyledFormGroupRow,
    Label as StyledLabel,
    LabelRow as StyledLabelRow,
    Switcher,
    Select,
    Error,
} from 'golos-ui/Form';
import Icon from 'golos-ui/Icon';

const Label = styled(StyledLabel)`
    margin-bottom: 20px;
`;

const FormGroupRow = styled(StyledFormGroupRow)`
    height: 20px;
`;

const LabelRow = styled(StyledLabelRow)`
    flex: 1;
    justify-content: flex-start;
`;

const LabelIcon = styled(StyledLabelRow)`
    flex-basis: 19px;
    color: #d7d7d7;
    margin-right: 20px;

    ${is('active')`
        color: #2879FF;
    `};
`;

const Email = ({ profile, onSubmit }) => {
    return (
        <Form onSubmit={onSubmit} initialValues={profile}>
            {({ handleSubmit, submitError, form, submitting, pristine, values }) => (
                <form onSubmit={handleSubmit}>
                    <CardContent column>
                        <FormGroup>
                            <Label dark>Мгновенные уведомления на сайте</Label>
                            <Field name="a">
                                {({ input }) => (
                                    <FormGroupRow>
                                        <LabelIcon active={input.value}>
                                            <Icon name="bell" width="19" height="20" />
                                        </LabelIcon>
                                        <LabelRow dark>
                                            Включить/выключить все онлайн уведомления
                                        </LabelRow>
                                        <Switcher {...input} />
                                    </FormGroupRow>
                                )}
                            </Field>
                        </FormGroup>
                        <Field name="a">
                            {({ input }) => (
                                <FormGroup>
                                    <Label>Периодичность</Label>
                                    <Select>
                                        <option>Ежедневно</option>
                                    </Select>
                                </FormGroup>
                            )}
                        </Field>
                        <Field name="b">
                            {({ input }) => (
                                <FormGroupRow>
                                    <LabelIcon active={input.value}>
                                        <Icon name="like" width="19" height="20" />
                                    </LabelIcon>
                                    <LabelRow dark>Лайк(голос)</LabelRow>
                                    <Switcher {...input} />
                                </FormGroupRow>
                            )}
                        </Field>
                        <Field name="c">
                            {({ input }) => (
                                <FormGroupRow>
                                    <LabelIcon active={input.value}>
                                        <Icon name="dislike" width="18" height="18" />
                                    </LabelIcon>
                                    <LabelRow dark>Дизлайк(жалоба)</LabelRow>
                                    <Switcher {...input} />
                                </FormGroupRow>
                            )}
                        </Field>
                        <Field name="c">
                            {({ input }) => (
                                <FormGroupRow>
                                    <LabelIcon active={input.value}>
                                        <Icon name="coins_plus" width="20" height="16" />
                                    </LabelIcon>
                                    <LabelRow dark>Перевод средств</LabelRow>
                                    <Switcher {...input} />
                                </FormGroupRow>
                            )}
                        </Field>
                        <Field name="c">
                            {({ input }) => (
                                <FormGroupRow>
                                    <LabelIcon active={input.value}>
                                        <Icon name="comment-reply" width="19" height="18" />
                                    </LabelIcon>
                                    <LabelRow dark>Ответ на пост или комментарий</LabelRow>
                                    <Switcher {...input} />
                                </FormGroupRow>
                            )}
                        </Field>
                        <Field name="c">
                            {({ input }) => (
                                <FormGroupRow>
                                    <LabelIcon active={input.value}>
                                        <Icon name="round-check" width="18" height="18" />
                                    </LabelIcon>
                                    <LabelRow dark>Подписка на блог</LabelRow>
                                    <Switcher {...input} />
                                </FormGroupRow>
                            )}
                        </Field>
                        <Field name="c">
                            {({ input }) => (
                                <FormGroupRow>
                                    <LabelIcon active={input.value}>
                                        <Icon name="round-cross" width="18" height="18" />
                                    </LabelIcon>
                                    <LabelRow dark>Отписка от блога</LabelRow>
                                    <Switcher {...input} />
                                </FormGroupRow>
                            )}
                        </Field>
                        <Field name="c">
                            {({ input }) => (
                                <FormGroupRow>
                                    <LabelIcon active={input.value}>
                                        <Icon name="at" width="17" height="17" />
                                    </LabelIcon>
                                    <LabelRow dark>
                                        Упоминание в посте или комменте через @
                                    </LabelRow>
                                    <Switcher {...input} />
                                </FormGroupRow>
                            )}
                        </Field>
                        <Field name="c">
                            {({ input }) => (
                                <FormGroupRow>
                                    <LabelIcon active={input.value}>
                                        <Icon name="repost-right" width="19" height="15" />
                                    </LabelIcon>
                                    <LabelRow dark>Репост</LabelRow>
                                    <Switcher {...input} />
                                </FormGroupRow>
                            )}
                        </Field>
                        <Field name="c">
                            {({ input }) => (
                                <FormGroupRow>
                                    <LabelIcon active={input.value}>
                                        <Icon name="a" width="14" height="15" />
                                    </LabelIcon>
                                    <LabelRow dark>Награда пользователю</LabelRow>
                                    <Switcher {...input} />
                                </FormGroupRow>
                            )}
                        </Field>
                        <Field name="c">
                            {({ input }) => (
                                <FormGroupRow>
                                    <LabelIcon active={input.value}>
                                        <Icon name="k" width="13" height="15" />
                                    </LabelIcon>
                                    <LabelRow dark>Награда куратору</LabelRow>
                                    <Switcher {...input} />
                                </FormGroupRow>
                            )}
                        </Field>
                        <Field name="c">
                            {({ input }) => (
                                <FormGroupRow>
                                    <LabelIcon active={input.value}>
                                        <Icon name="comment" width="19" height="15" />
                                    </LabelIcon>
                                    <LabelRow dark>Личное сообщения</LabelRow>
                                    <Switcher {...input} />
                                </FormGroupRow>
                            )}
                        </Field>
                    </CardContent>
                    <CardDivider />
                    <CardContent column>
                        <Field name="c">
                            {({ input }) => (
                                <FormGroupRow>
                                    <LabelRow dark>
                                        Количество авторских и кураторских наград за день/неделю
                                    </LabelRow>
                                    <Switcher {...input} />
                                </FormGroupRow>
                            )}
                        </Field>
                        <Field name="c">
                            {({ input }) => (
                                <FormGroupRow>
                                    <LabelRow dark>
                                        Количество лайков или награды одного поста
                                    </LabelRow>
                                    <Switcher {...input} />
                                </FormGroupRow>
                            )}
                        </Field>
                        <Field name="c">
                            {({ input }) => (
                                <FormGroupRow>
                                    <LabelRow dark>
                                        Мощность Голоса за сутки
                                    </LabelRow>
                                    <Switcher {...input} />
                                </FormGroupRow>
                            )}
                        </Field>

                        {submitError && <div>{submitError}</div>}
                    </CardContent>
                    <DialogFooter>
                        <DialogButton onClick={form.reset} disabled={submitting || pristine}>
                            {tt('settings_jsx.reset')}
                        </DialogButton>
                        <DialogButton type="submit" primary disabled={submitting}>
                            {tt('settings_jsx.update')}
                        </DialogButton>
                    </DialogFooter>
                </form>
            )}
        </Form>
    );
};

export default Email;