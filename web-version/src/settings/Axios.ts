import axios, { type AxiosInstance, type AxiosResponse } from 'axios'
import { type RequestResult } from '../interfaces/Request'

class Axios {
  constructor() {
    this.instance = axios.create({
      baseURL: 'http://localhost:8080',
      timeout: 10000
    })
  }

  protected instance: AxiosInstance

  protected async Get(query: string): Promise<RequestResult> {
    let result: RequestResult = {
      isSuccess: false,
      message: '',
      statusCode: 500,
      data: {}
    }

    try {
      const response: AxiosResponse = await this.instance.get(query)
      result = {
        isSuccess: response.status === 200,
        message: '',
        statusCode: response.status,
        data: response.data
      }
    } catch (error: any) {
      result.message = error
    }

    return result
  }

  protected async Post(query: string, body: any): Promise<RequestResult> {
    let result: RequestResult = {
      isSuccess: false,
      message: '',
      statusCode: 500,
      data: {}
    }

    try {
      const response: AxiosResponse = await this.instance.post(query, body)
      result = {
        isSuccess: response.status === 200,
        message: '',
        statusCode: response.status,
        data: response.data
      }
    } catch (error: any) {
      result.message = error
    }

    return result
  }
}

export default Axios
