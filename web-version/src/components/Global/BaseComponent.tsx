import React from 'react'
import { type User } from '../../interfaces/User'
import Axios from '../../settings/Axios'

export default class BaseComponent extends React.Component {
  constructor(props: Readonly<any>) {
    super(props)
    this.Axios = new Axios()
    this.User = null
  }

  protected Axios: Axios
  protected User: User | null
}
